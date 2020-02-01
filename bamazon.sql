DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL (10,2) NOT NULL,
    stock_quantity INT CHECK (stock_quantity >= 0) default 0 NOT NULL,
    product_sales DECIMAL (10,2) default 0 NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Justin Timberlake's half-eaten French toast", "grocery", 1000.03, 1),
       ("Broken laser pointe", "necessity", 14.38, 1),
       ("Chost in a jar", "necessity", 31.01, 1),
       ("Gummy bear", "grocery", 3.99, 50),
       ("Eloquent JavaScript", "books", 25.49, 10),
       ("Introduction to Algorithms", "books", 63.37, 20),
       ("Cards Against Humanity", "games", 25.91, 12),
       ("Milk-Bone MaroSnacks Dog Treats", "pets", 6.79, 100),
       ("Friends Forever Donut Cat Bed", "pets", 39.99, 5),
       ("Endless coffee mug", "necessity", 24.99, 3);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL,
    over_head_cost INT default 0 NOT NULL
);

INSERT INTO departments (department_name, over_head_cost)
VALUES ("grocery", 10000),
       ("necessity", 2000),
       ("books", 300),
       ("games", 10),
       ("pets", 10000)









