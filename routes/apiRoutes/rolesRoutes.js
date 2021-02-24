const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

// originally app.get('/api/roles')
router.get('/roles', (req, res) => {
    const sql = `SELECT * FROM roles`;
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
  
  // app.get('/api/roles/:id')
  router.get('/roles/:id', (req, res) => {
    const sql = `SELECT * FROM roles WHERE id = ?`;
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
  
  // app.put('/api/roles/:id')
  router.put('/roles/:id', (req, res) => {
      // Role is allowed to not have department affiliation
    const errors = inputCheck(req.body, 'department_id');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
  
    const sql = `UPDATE roles SET department_id = ? 
                 WHERE id = ?`;
    const params = [req.body.department_id, req.params.id];
    // function,not arrow, to use this
    db.run(sql, params, function(err, result) {
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
  
  // app.delete('/api/roles/:id')
  router.delete('/roles/:id', (req, res) => {const sql = `DELETE FROM roles WHERE id = ?`;
  const params = [req.params.id];
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.json({ message: 'successfully deleted', changes: this.changes });
  });
});

module.exports = router;