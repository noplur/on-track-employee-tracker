// const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql');

// Connect to database
const db = new mysql.createConnection('./db/departments.db', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the departments database.');
});

module.exports = db;