const mysql = require("mysql");
const inquirer = require("inquirer");

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "",
    password: "",
    database: "bamazon_db"
});

const priceQuantity = '\033[0;32m';
const resetColor = '\033[0m';

db.connect(err => {
    if (err) { throw err; }
    storeOperation();
});

function storeOperation() {
    inquirer
        .prompt({
            name: "answer",
            type: "list",
            message: "Choose the command:",
            choices: [
                { name: "Products for Sale", value: 0 },
                { name: "Low Inventory", value: 1 },
                { name: "Add to inventory", value: 2 },
                { name: "Add new products", value: 3 }
            ]
        })
        .then(command => {
            switch (command.answer) {
                case 0:
                    showAllProd();
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
            }
        });
}

function showAllProd() {
    db.query("SELECT * FROM products", (err, items) => {
        if (err) { throw err; }
        items.forEach(item => {
            console.log(`${item.id} ${item.product_name} ${priceQuantity} price:${resetColor} ${item.price} ${priceQuantity} quantity:${resetColor} ${item.stock_quantity}`);
        })
    });
}

function showLowInventory() {
    db.query(
        "SELECT * FROM products WHERE stock_quantity < 5",
        (err, items) => {
            if (err) { throw err; }
            items.forEach(item => {
                console.log(`${item.id} ${item.product_name} ${priceQuantity} price:${resetColor} ${item.price} ${priceQuantity} quantity:${resetColor} ${item.stock_quantity}`);
            })
        }
    )
}

function addToInventory() {
    db.query("SELECT * FROM products", (err, choices) => {
        if (err) { throw err; }
        inquirer
            .prompt({
                name: "product",
                type: "list",
                message: "Select product!",
                choices: choices.map(item => {
                    return {
                        name: `* ${item.product_name}`,
                        value: item
                    }
                })
            })
            .then(answer => {
                console.log(`id:${answer.product.id} \nname: ${answer.product.product_name} \ndepartment: ${answer.product.department_name} \nprice: ${answer.product.price} \nquantity: ${answer.product.stock_quantity}`);
                console.log("Update select product.");
                productUpdate(answer.product);
            })
    })
}

function productUpdate(product) {
    inquirer
        .prompt({
            name: "quantitie",
            type: "input",
            message: "Add replenishment quantitie",
        })
        .then(answer => {
            db.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?", [answer.quantitie, product.id], err => {
                if (err) { throw err; };
                console.log("Product restock successfully!");
            })
        })
}
