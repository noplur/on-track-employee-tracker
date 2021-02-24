const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const inputCheck = require('./utils/inputCheck');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database 
const db = new sqlite3.Database('./db/departments.db', err => {
  if (err) {
    return console.error(err.message);
  }

  console.log('Connected to the departments database.');
});

// Get all departments 
app.get('/api/departments', (req, res) => {
  const sql = `SELECT roles.*, departments.depName
              FROM roles
              LEFT JOIN departments
              ON roles.department_id = departments.id`;
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Get single departments
app.get('/api/departments/:id', (req, res) => {
  const sql = `SELECT roles.*, departments.depName
              FROM roles
              LEFT JOIN departments
              ON roles.department_id = departments.id
              WHERE departments.id = ?`;
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: row
    });
  });
});

// Create a departments
app.post('/api/departments', ({ body }, res) => {
  const errors = inputCheck(body, 'depName');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql =  `INSERT INTO departments (depName) 
                VALUES (?)`;
  const params = [body.depName];
  // ES5 function, not arrow function, to use this
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: body,
      id: this.lastID
    });
  });
});

// Delete a departments
app.delete('/api/departments/:id', (req, res) => {
  const sql = `DELETE FROM departments WHERE id = ?`;
  const params = [req.params.id]
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.json({ message: 'successfully deleted', changes: this.changes });
  });
});

// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
  res.status(404).end();
}); 

// Start server after DB connection
db.on('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});