const inquirer = require ("inquirer");
const mysql = require ("mysql2");
const db = require('./db/database');
const express = require('express');
const inputCheck = require('./utils/inputCheck');
const apiRoutes = require('./routes/apiRoutes');
const startApp = require('./start')

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', apiRoutes);

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

// const router = express.Router();

const connection = mysql.createConnection({host: "localhost", user: "root", password: "rosenblatt1234!", database: "departments"})

// function startApp () {

function main () {
    inquirer.prompt([
        {type: "list",
        name: "initialchoice",
        message: "What do you want to do",
        choices: ["View all employees", "View all roles", "View all departments", "Add employee", "Add role", "Add department", "Update employee role"]
        }
    ])
    .then((answers) => {
        if (answers.initialchoice === "View all employees") {
            viewAllEmployees ();
        } else if (answers.initialchoice === "View all roles") {
            viewAllRoles();
        } else if (answers.initialchoice === "View all departments") {
            viewAllDepartments();
        } else if (answers.initialchoice === "Add employee") {
            addEmployee();
        }
        else if (answers.initialchoice === "Add role") {
            addRole();
        }
        else if (answers.initialchoice === "Add department") {
            addDepartment();
        }
        else if (answers.initialchoice === "Update employee role") {
            updateRole();
        }
        
    })
}

function viewAllEmployees () {
    const sql = `SELECT employees.*, roles.title, roles.salary, departments.depName
    FROM employees
    LEFT JOIN roles
    ON employees.role_id = roles.id
    LEFT JOIN departments
    ON roles.department_id = departments.id`;
    connection.promise().query(sql).then(data => {
        console.table(data[0])
        main()
    })
}

function viewAllRoles () {
    const sql = `SELECT roles.*, departments.depName
    FROM roles
    LEFT JOIN departments
    ON roles.department_id = departments.id`;
    connection.promise().query(sql).then(data => {
        console.table(data[0])
        main()
    })
}

function viewAllDepartments () {
    const sql = `SELECT * FROM departments`
    connection.promise().query(sql).then(data => {
        console.table(data[0])
        main()
    })
}
function addEmployee () {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?"
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the role id for this employee?"
        },
        {
            type: "input",
            name: "manager_id",
            message: "What is the manager id for this employee?"
        },
    ]).then((answers) => {
    connection.promise().query(`INSERT INTO employees set ?`, answers).then(data => {
        console.log("inserted employees; " + (+data[0].affectedRows > 0))
        main ()
    })
})
}
function addDepartment () {
    inquirer.prompt([
        {
            type: "input",
            name: "depName",
            message: "What is the department name you would like to add?"
        }
    ]).then((answers) => {
    connection.promise().query("insert into departments set ?", answers).then(data => {
        console.log("inserted department; " + (+data[0].affectedRows > 0))
        main()
    })
})
}
function addRole () {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the role name you would like to add?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the role salary?"
        },
        {
            type: "input",
            name: "department_id",
            message: "What is the department id for this role?"
        },
    ]).then((answers) => {
    connection.promise().query(`INSERT INTO roles set ?`, answers).then(data => {
        console.log("inserted role; " + (+data[0].affectedRows > 0))
        main ()
    })
})
}

function updateRole () {
    connection.promise().query("select * from Departments").then(data => {
        console.table(data[0])
        main()
    })
}

main()

// }

// module.exports = startApp;