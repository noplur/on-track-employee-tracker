INSERT INTO departments (depName)
VALUES
('Finance'),
('Engineering'),
('Sales'),
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
('Sales Lead', '100000', 4),
('Salesperson', '80000', 4),
('Lead Engineer', '150000', 3),
('Software Engineer', '120000', 3),
('Accountant', '125000', 2),
('Legal Team Lead', '250000', 5),
('Lawyer', '190000', 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Dean', 'Ween', 8, 3),
('Gene', 'Ween', 2, 1),
('Allison', 'Chains', 3, null),
('Justin', 'Time', 4, 3),
('Jody', 'Macleod', 5, null),
('Aaliyah', 'Crane', 6, null),
('Lexie', 'Hanna', 7, 6),
('Gia', 'Cannon', 4, 3);