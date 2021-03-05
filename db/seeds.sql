INSERT INTO departments (depName)
values
('Legal'),
('Finance'),
('Engineering'),
('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES
('Sales Lead', '100000', 4),
('Salesperson', '80000', 4),
('Lead Engineer', '150000', 3),
('Software Engineer', '120000', 3),
('Accountant', '125000', 2),
('Legal Team Lead', '250000', 1),
('Lawyer', '190000', 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Dean', 'Jones', 1, null),
('Gene', 'Jones', 2, 1),
('Allison', 'Chains', 3, null),
('Justin', 'Time', 4, 3),
('Aaliyah', 'Crane', 6, null),
('Lexie', 'Hanna', 2, 1),
('Gia', 'Cannon', 4, 3),
('Seth', 'Smith', 7, 5),
('Jessie', 'Kahn', 5, null);