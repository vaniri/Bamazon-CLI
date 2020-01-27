const mysql = require("mysql");
const inquirer = require("inquirer");

const price = '\033[0;34m';
const outOfStock = '\033[0;31m';
const exit = '\033[0;36m';
const reset = '\033[0m';
const divider = '-------------------------------------------------------------------------------------'

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "",
    password: "",
    database: "bamazon_db"
});

db.connect(err => {
    if (err) throw err;
});

function startShopping() {
    db.query("SELECT * FROM products", (err, choices) => {
        if (err) throw err;
        runInquirer(choices);

    });
}

startShopping();

function runInquirer(choices) {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: `Welcome to the Bamazon! Check our amazing items and buy what you like!\n`,
            choices: choices.map(item => {
                return {
                    name: `* ${item.product_name} ${price}$$${item.price} ${reset}`,
                    value: item
                }
            })
        })
        .then(answer => {
            handleProduct(answer.choice.id, answer.choice.price);
        })
}

function handleProduct(itemId, itemPrice) {
    inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: "How many units would you like to buy?",
        })
        .then(answer => {
            db.query(
                "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                [answer.quantity, itemId],
                err => {
                    if (err) {
                        console.log(`${outOfStock} Sorry! The item is out of stock! ${reset}`);
                        newPurchase();
                    } else {
                        let totalPrice = itemPrice * answer.quantity;
                        console.log(`Total price: ${price} ${totalPrice} ${reset}`);
                        console.log("Thank you for your purchase!");
                        newPurchase();
                    }
                }
            )
        })
}

function newPurchase() {
    inquirer
        .prompt({
            name: "answer",
            type: "list",
            message: " ",
            choices: ["BACK TO THE STORE", "EXIT"]
        })
        .then(answer => {
            if (answer.answer === "EXIT") {
                db.destroy();
            } else {
                startShopping();
            }
        });

}

