const inquirer = require ("inquirer");
const mysql = require ("mysql2");
const db = require('./db/database');
const express = require('express');
const inputCheck = require('./utils/inputCheck');
const apiRoutes = require('./routes/apiRoutes');
const startApp = require('./start');
const ExpandPrompt = require("inquirer/lib/prompts/expand");

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

const employeeList = [];
  connection.query("SELECT * FROM employees", function(err, answer) {
    for (let i = 0; i < answer.length; i++) {
      let employeeString =
        answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
        employeeList.push(employeeString);
    }
  })


const roleList = [];
  connection.query("SELECT * FROM roles", function(err, answer) {
    for (let i = 0; i < answer.length; i++) {
      let roleString =
      answer[i].id + " " + answer[i].title;
        roleList.push(roleString);
    }
  })

const departmentList = [];
  connection.query("SELECT * FROM departments", function(err, answer) {
    for (let i = 0; i < answer.length; i++) {
      let departmentString =
      answer[i].id + " " + answer[i].depName;
      departmentList.push(departmentString);
    }
  })

const managerList = [];
  connection.query("SELECT * FROM employees", function(err, answer) {
    for (let i = 0; i < answer.length; i++) {
      let managerString =
        answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
        managerList.push(managerString);
    }
        managerList.push("Employee does not have manager");
})

function viewAllEmployees () {    
    const sql = `SELECT employees.id AS \"ID\", CONCAT (employees.first_name, " " , employees.last_name) AS \"Employee Name\", roles.title AS \"Title\", departments.depName AS \"Department\", roles.salary AS \"Salary\", CONCAT (mgr.first_name, " " , mgr.last_name) AS \"Manager\"
    FROM employees
    LEFT JOIN roles
    ON employees.role_id = roles.id
    LEFT JOIN departments
    ON roles.department_id = departments.id
    LEFT JOIN employees mgr
    ON mgr.id = employees.manager_id`;
    connection.promise().query(sql).then(data => {
        console.table(data[0])
        main()
    })
}

function viewAllRoles () {
    const sql = `SELECT roles.id AS \"ID\", roles.title AS \"Title\", roles.salary AS \"Salary\", departments.depName AS \"Department\"
    FROM roles
    LEFT JOIN departments
    ON roles.department_id = departments.id`;
    connection.promise().query(sql).then(data => {
        console.table(data[0])
        main()
    })
}

function viewAllDepartments () {
    const sql = `SELECT departments.id AS \"ID\", departments.depName AS \"Department\"
    FROM departments`
    connection.promise().query(sql).then(data => {
        console.table(data[0])
        main()
    })
}

// make manager id actual manager name
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
            type: "list",
            name: "role",
            message: "What is this employee's role?",
            choices: roleList
        },
        {
            type: "list",
            name: "manager",
            message: "Who is this employee's manager?",
            choices: managerList
        },
    ]).then((answers) => {
        let roleIndex = roleList.indexOf(answers.role) + 1;
        let managerIndex = managerList.indexOf(answers.manager) + 1;
        console.log(roleIndex, managerIndex)
        if (answers.manager === "Employee does not have manager") {
            connection.promise().query(`INSERT INTO employees (employees.first_name, employees.last_name, employees.role_id, employees.manager_id) values (?,?,?, null)`, [answers.first_name, answers.last_name, roleIndex, answers.manager]).then(data => {
                console.log("inserted employees; " + (+data[0].affectedRows > 0))
                main ()
            })
        } else {


        connection.promise().query(`INSERT INTO employees set employees.first_name = ?, employees.last_name = ? , employees.role_id = ?, employees.manager_id = ?`, [answers.first_name, answers.last_name, roleIndex, managerIndex]).then(data => {
        console.log("inserted employees; " + (+data[0].affectedRows > 0))
        main ()
        
    })
}
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
            message: "What is the role name you would like to add?",
            validate: function(input){
                if (input === ""){
                    console.log("Employee Role Required");
                    return false;
                }
                else{
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "salary",
            message: "What is the role salary?",
            validate: input => {
                if (!isNaN(input)) {
                    return true;
                }
                return "Please enter a valid number."
            }
        },
        {
            type: "list",
            name: "department",
            message: "What is the department for this role?",
            choices: departmentList
        },
    ]).then((answers) => {
        let departmentIndex = departmentList.indexOf(answers.department) + 1;
        console.log(departmentIndex)
    connection.promise().query(`INSERT INTO roles set roles.title = ?, roles.salary = ? , roles.department_id = ?`, [answers.title, answers.salary, departmentIndex]).then(data => {
        console.log("inserted role; " + (+data[0].affectedRows > 0))
        main ()
    })
})
}

function updateRole () {
    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Select the employee you would like to update.",
            choices: employeeList
        },
        {
            type: "list",
            name: "role",
            message: "Select the employee's updated role.",
            choices: roleList
        },
    ]).then((answers) => {
        let roleIndex = roleList.indexOf(answers.role) + 1;
        let employeeIndex = employeeList.indexOf(answers.employee) + 1;
        console.log(roleIndex, employeeIndex)
    connection.promise().query(`UPDATE employees SET employees.role_id = ? WHERE employees.id = ?`, [roleIndex, employeeIndex]).then(data => {
        console.log("updated employee role; " + (data[0].affectedRows))
        main ()
    })
})
}

main()