const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('./db/departments.db', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the departments database.');
});

module.exports = db;