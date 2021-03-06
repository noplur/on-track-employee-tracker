const inquirer = require ("inquirer");
const mysql = require ("mysql2");
const db = require('./db/database');
const express = require('express');
const inputCheck = require('./utils/inputCheck');
const apiRoutes = require('./routes/apiRoutes');
const startApp = require('./start');
const ExpandPrompt = require("inquirer/lib/prompts/expand");

const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());

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

// function to start App () {

function main () {
    inquirer.prompt([
        // menu questions
        {type: "list",
        name: "initialchoice",
        message: "What do you want to do",
        choices: ["View all employees", "View all roles", "View all departments", "Add employee", "Add role", "Add department", "Update employee role", "Update employee managers", "View employees by manager", "View employees by department", "Delete department", "Delete role", "Delete employee", "View sum of all employee's salaries", "Exit menu"]
        }
    ])
    .then((answers) => {
        // functions linked to menu questions
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
        else if (answers.initialchoice === "Update employee managers") {
            updateManager();
        }
        else if (answers.initialchoice === "View employees by manager") {
            viewEmployeeByManager();
        }
        else if (answers.initialchoice === "View employees by department") {
            viewEmployeeByDepartment();
        }
        else if (answers.initialchoice === "Delete department") {
            deleteDepartment();
        }
        else if (answers.initialchoice === "Delete role") {
            deleteRole();
        }
        else if (answers.initialchoice === "Delete employee") {
            deleteEmployee();
        }
        else if (answers.initialchoice === "View sum of all employee's salaries") {
            salarySum();
        }
        else if (answers.initialchoice === "Exit menu") {
            exitMenu();
        }
    })
}

// variable to display employee list
const employeeList = [];
  connection.query("SELECT * FROM employees", function(err, answer) {
    if (err) throw err 
    for (let i = 0; i < answer.length; i++) {
      let employeeString =
        answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
        employeeList.push(employeeString);
    }
  })
  
// variable to display department list
const departmentList = [];
  connection.query("SELECT * FROM departments", function(err, answer) {
    for (let i = 0; i < answer.length; i++) {
      let departmentString =
      answer[i].id + " " + answer[i].depName;
      departmentList.push(departmentString);
    }
  })

// variable to display manager list
const managerList = [];
  connection.query("SELECT * FROM employees", function(err, answer) {
    for (let i = 0; i < answer.length; i++) {
      let managerString =
        answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
        managerList.push(managerString);
    }
        managerList.push("Employee does not have manager");
})

// function for table to view all employees
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

// function for table to view all employees by Manager
function viewEmployeeByManager() {
    const sql = `SELECT employees.id AS \"ID\", CONCAT (mgr.first_name, " " , mgr.last_name) AS \"Manager\", CONCAT (employees.first_name, " " , employees.last_name) AS \"Employee Name\", roles.title AS \"Title\", departments.depName AS \"Department\", roles.salary AS \"Salary\"
    FROM employees
    LEFT JOIN roles
    ON employees.role_id = roles.id
    LEFT JOIN departments
    ON roles.department_id = departments.id
    LEFT JOIN employees mgr
    ON mgr.id = employees.manager_id
    ORDER BY employees.manager_id DESC`;
    connection.promise().query(sql).then(data => {
        console.table(data[0])
        main()
    })
}

// function for table to view all employees by Department
function viewEmployeeByDepartment() {
    const sql = `SELECT employees.id AS \"ID\", departments.depName AS \"Department\", CONCAT (employees.first_name, " " , employees.last_name) AS \"Employee Name\", roles.title AS \"Title\", roles.salary AS \"Salary\", CONCAT (mgr.first_name, " " , mgr.last_name) AS \"Manager\"
    FROM employees
    LEFT JOIN roles
    ON employees.role_id = roles.id
    LEFT JOIN departments
    ON roles.department_id = departments.id
    LEFT JOIN employees mgr
    ON mgr.id = employees.manager_id
    ORDER BY roles.department_id DESC`;
    connection.promise().query(sql).then(data => {
        console.table(data[0])
        main()
    })
}

// function for table to view all roles
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

// function for table to view all departments
function viewAllDepartments () {
    const sql = `SELECT departments.id AS \"ID\", departments.depName AS \"Department\"
    FROM departments`
    connection.promise().query(sql).then(data => {
        console.table(data[0])
        main()
    })
}

// function to add a department
function addDepartment () {
    inquirer.prompt([
        {
            type: "input",
            name: "depName",
            message: "What is the department name you would like to add?"
        }
    ]).then((answers) => {
    connection.promise().query("INSERT INTO departments set ?", answers).then(data => {
        console.log("inserted department; " + (+data[0].affectedRows > 0))
        main()
    })
})
}

// function to delete a department
function deleteDepartment() {
    inquirer.prompt([
        {
            type: "list",
            name: "depName",
            message: "What is the department name you would like to delete?",
            choices: departmentList
        }
    ]).then((answers) => {
        let departmentIndex = parseInt(answers.depName.split(" ")[0]);
        console.log(departmentIndex, answers.id, answers.depName)
        connection.promise().query("DELETE FROM departments WHERE departments.id = ?", [departmentIndex]).then(data => {
        console.log("deleted department; " + (data[0].affectedRows > 0))
        main()
    })
})
}

// function to add a role
function addRole () {
    // variable to display department list is repeated in case of any additions/changes
    const departmentList = [];
    connection.query("SELECT * FROM departments", function(err, answer) {
    for (let i = 0; i < answer.length; i++) {
        let departmentString =
        answer[i].id + " " + answer[i].depName;
        departmentList.push(departmentString);
    }
    })
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
        let departmentIndex = parseInt(answers.department.split(" ")[0]);
        console.log(departmentIndex)
    connection.promise().query(`INSERT INTO roles set roles.title = ?, roles.salary = ? , roles.department_id = ?`, [answers.title, answers.salary, departmentIndex]).then(data => {
        console.log("inserted role; " + (+data[0].affectedRows > 0))
        main ()
    })
})
}

// function to delete a role
function deleteRole() {
    inquirer.prompt([
        {
            type: "list",
            name: "role",
            message: "What is the role name you would like to delete?",
            choices: roleList
        }
    ]).then((answers) => {
        let roleIndex = parseInt(answers.role.split(" ")[0]);
        console.log(roleIndex, answers.id, answers.role)
        connection.promise().query("DELETE FROM roles WHERE roles.id = ?", [roleIndex]).then(data => {
        console.log("deleted role; " + (data[0].affectedRows > 0))
        main()
    })
})
}

// variable to display list of roles
const roleList = [];
  connection.query("SELECT * FROM roles", function(err, answer) {
    for (let i = 0; i < answer.length; i++) {
      let roleString =
      answer[i].id + " " + answer[i].title;
        roleList.push(roleString);
    }
  })

  // function to add an employee
function addEmployee () {
    const roleList = [];
  connection.query("SELECT * FROM roles", function(err, answer) {
    for (let i = 0; i < answer.length; i++) {
      let roleString =
      answer[i].id + " " + answer[i].title;
        roleList.push(roleString);
    }
  })

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
        let roleIndex = parseInt(answers.role.split(" ")[0]);
        let managerIndex = parseInt(answers.manager.split(" ")[0]);
        console.log(roleIndex, managerIndex)
        // insert new employee into table
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

  // function to delete an employee
function deleteEmployee() {
    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "What is the role name you would like to delete?",
            choices: employeeList
        }
    ]).then((answers) => {
        let employeeIndex = parseInt(answers.employee.split(" "));
        console.log(employeeIndex, answers.id, answers.employee)
        connection.promise().query("DELETE FROM employees WHERE employees.id = ?", [employeeIndex]).then(data => {
        console.log("deleted employee; " + (data[0].affectedRows > 0))
        main()
    })
})
}

  // function to update a role
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
        let roleIndex = parseInt(answers.role.split(" ")[0]);
        let employeeIndex = parseInt(answers.employee.split(" ")[0]);
        console.log(roleIndex, employeeIndex)
    connection.promise().query(`UPDATE employees SET employees.role_id = ? WHERE employees.id = ?`, [roleIndex, employeeIndex]).then(data => {
        console.log("updated employee role; " + (data[0].affectedRows))
        main ()
    })
})
}

  // function to update a manager
function updateManager () {
    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Select the employee whose manager you would like to update.",
            choices: employeeList
        },
        {
            type: "list",
            name: "mgr",
            message: "Select the employee's updated manager.",
            choices: managerList
        },
    ]).then((answers) => {
        let employeeIndex = parseInt(answers.employee.split(" ")[0]);
        let mgrIndex = parseInt(answers.mgr.split(" ")[0]);
        console.log(mgrIndex, employeeIndex)

        if (answers.mgr === "Employee does not have manager") {
            connection.promise().query(`UPDATE employees SET employees.manager_id = "null" WHERE employees.id = ?`, [mgrIndex, employeeIndex]).then(data => {
            console.log("updated employee's manager; " + (data[0].affectedRows))
            main ()
            })
        } else {
            connection.promise().query(`UPDATE employees SET employees.manager_id = ? WHERE employees.id = ?`, [mgrIndex, employeeIndex]).then(data => {
            console.log("updated employee's manager; " + (data[0].affectedRows))
            main ()
        })
    }
    })
    }

// function to display the total sum of all salaries
function salarySum() {
    const sql = `SELECT SUM(roles.salary) AS \"Combined Salaries of All Employees\" FROM roles`;
    connection.promise().query(sql).then(data => {
        console.table(data[0])
        main()
    })
}

// function to exit
function exitMenu () {
    console.log("Thank you for using the On-Track Employee Tracker!")
    process.exit();
}

// start App
main()