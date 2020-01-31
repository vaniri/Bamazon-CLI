DROP DATABASE IF EXISTS departments_db;
CREATE DATABASE departments_db;

USE departments_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_cost INT CHECK default 0 NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (department_name, over_head_cost)
VALUES ("Justin Timberlake's half-eaten French toast", 1),