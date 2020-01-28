const mysql = require("mysql");
const inquirer = require("inquirer");

const price = '\033[0;34m';
const outOfStock = '\033[0;31m';
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
    startShopping();
});

function startShopping() {
    db.query("SELECT * FROM products", (err, choices) => {
        if (err) { throw err; }
        runInquirer(choices);

    });
}

async function runInquirer(choices) {
    let answer = await inquirer
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
    handleProduct(answer.choice.id, answer.choice.price);
}

async function handleProduct(itemId, itemPrice) {
    let answer = await inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: "How many units would you like to buy?",
        })

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
}

async function newPurchase() {
    let answer = await inquirer
        .prompt({
            name: "answer",
            type: "list",
            message: " ",
            choices: ["BACK TO THE STORE", "EXIT"]
        })
    if (answer.answer === "EXIT") {
        db.destroy();
    } else {
        startShopping();
    }

}

