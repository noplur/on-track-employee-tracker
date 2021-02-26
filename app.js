const inquirer = require ("inquirer")
const mysql = require ("mysql2")

const connection = mysql.createConnection({host: "localhost", user: "root", password: "rosenblatt1234!", database: "departments"})

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
    const sql = `SELECT * FROM employees`;
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
    connection.promise().query("select * from Departments").then(data => {
        console.table(data[0])
        main()
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
        }
    ]).then((answers) => {
    connection.promise().query("insert into roles set ?", answers).then(data => {
        console.log("inserted role; " + (+data[0].affectedRows > 0))
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