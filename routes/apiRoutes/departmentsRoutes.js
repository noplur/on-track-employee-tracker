const express = require('express');
const router = express.Router();
const db = require('../../db/database');

// Get all departments
router.get('/departments', (req, res) => {
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
router.get('/departments/:id', (req, res) => {
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
router.post('/api/departments', ({ body }, res) => {
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
router.delete('/departments/:id', (req, res) => {const sql = `DELETE FROM departments WHERE id = ?`;
const params = [req.params.id]
db.run(sql, params, function(err, result) {
  if (err) {
    res.status(400).json({ error: res.message });
    return;
  }

  res.json({ message: 'successfully deleted', changes: this.changes });
});
});

module.exports = router;