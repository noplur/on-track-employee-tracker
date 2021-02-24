const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.get('/employees', (req, res) => {
    const sql = `SELECT * FROM employees ORDER BY last_name`;
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

router.get('/employees/:id', (req, res) => {
const sql = `SELECT * FROM employees WHERE id = ?`;
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

router.post('/employees', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'role_id', 'manager_id');

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  
  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

  db.run(sql, params, function(err, data) {
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

router.put('/employees/:id', (req, res) => {
// Data validation
const errors = inputCheck(req.body, 'last_name');
if (errors) {
    res.status(400).json({ error: errors });
    return;
}

// Prepare statement
const sql = `UPDATE employees SET last_name = ? WHERE id = ?`;
const params = [req.body.last_name, req.params.id];

// Execute
db.run(sql, params, function(err, data) {
    if (err) {
    res.status(400).json({ error: err.message });
    return;
    }

    res.json({
    message: 'success',
    data: req.body,
    changes: this.changes
    });
});
});  

router.delete('/employees/:id', (req, res) => {
const sql = `DELETE FROM employees WHERE id = ?`;

db.run(sql, req.params.id, function(err, result) {
    if (err) {
    res.status(400).json({ error: res.message });
    return;
    }

    res.json({ message: 'deleted', changes: this.changes });
});
});

  module.exports = router;