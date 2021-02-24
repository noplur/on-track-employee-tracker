DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

CREATE TABLE roles (
  id INTEGER PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE departments (
id INTEGER PRIMARY KEY,
depName VARCHAR(30) NOT NULL
);