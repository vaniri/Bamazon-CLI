const mysql = require("mysql");
const inquirer = require("inquirer");
const utils = require("./utils");
const success = '\033[0;32m';
const reset = '\033[0m';

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "",
    password: "",
    database: "bamazon_db"
});

db.connect(err => {
    if (err) { throw err; }
    storeOperation();
});

async function storeOperation() {
    let command = await inquirer
        .prompt({
            name: "answer",
            type: "list",
            message: "\n-----------------------------------------------------------------"
                + "\nYou are in Bamazon Manager mode. Choose the command below:\n"
                + "-----------------------------------------------------------------\n",
            choices: [
                { name: "Products for Sale", value: 0 },
                { name: "Low Inventory", value: 1 },
                { name: "Add to inventory", value: 2 },
                { name: "Add new products", value: 3 },
                { name: "EXIT", value: 4 }
            ]
        })

    switch (command.answer) {
        case 0:
            showProducts();
            break;
        case 1:
            showLowInventory();
            break;
        case 2:
            addToInventory();
            break;
        case 3:
            addNewProd();
            break;
        case 4:
            db.destroy();
            break;
    }
}

function showProducts() {
    db.query("SELECT * FROM products", (err, products) => {
        if (err) { throw err; }
        utils.showProducts(products);
        newOperation();
    });
}

function showLowInventory() {
    db.query("SELECT * FROM products WHERE stock_quantity < 5", (err, items) => {
        if (err) { throw err; }
        utils.showProducts(items);
        newOperation();
    });
}

function addToInventory() {
    db.query("SELECT * FROM products", async (err, choices) => {
        if (err) { throw err; }
        let answer = await inquirer
            .prompt({
                name: "product",
                type: "list",
                message: "Select product:",
                choices: choices.map(item => {
                    return {
                        name: `* ${item.product_name}`,
                        value: item
                    }
                })
            });

        console.log(`id:${answer.product.id} \nname: ${answer.product.product_name} \ndepartment: ${answer.product.department_name} \nprice: ${answer.product.price} \nquantity: ${answer.product.stock_quantity}`);
        console.log("Update select product.");
        productUpdate(answer.product);
    })
}

async function productUpdate(product) {
    let answer = await inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: "Add restocking quantity",
            validate: value => {
                return !isNaN(value) && value > 0;
            }
        });
    db.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?",
        [answer.quantity, product.id],
        err => {
            if (err) { throw err; };
            console.log(success, "Product restocked successfully!", reset);
            newOperation();
        });
}

async function addNewProd() {
    let answer = await inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Enter product name:",
                validate: value => {
                    return (value.length > 0);
                }
            },
            {
                name: "department",
                type: "input",
                message: "Enter department name:",
                validate: value => {
                    return (value.length > 0);
                }
            },
            {
                name: "price",
                type: "input",
                message: "Enter product price:",
                validate: value => {
                    return !isNaN(value) && value > 0;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter product quantity:",
                validate: value => {
                    return !isNaN(value) && value > 0;
                }
            }
        ]);
    db.query(
        "INSERT INTO products SET ?",
        {
            product_name: answer.name,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
        },
        err => {
            if (err) throw err;
            console.log(success, "New product was added successfully!", reset);
            newOperation();
        }
    );
}

function newOperation() {
    let choices = ["NEW OPERATION", "EXIT"];
    utils.handleExit(storeOperation, db, choices);
}
