const mysql = require("mysql");
const inquirer = require("inquirer");
const utils = require("./utils");

const priceColor = '\033[0;34m';
const outOfStock = '\033[0;31m';
const thankForPurchColor = '\033[0;32m';
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

async function startShopping() {
    let answer = await inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "\n-----------------------------------------------------------------"
                + "\nWelcome To The Bamazon!\n"
                + "-----------------------------------------------------------------\n",
            choices: ["SEE ITEMS FOR SALE", "EXIT"]
        });
    if (answer.choice === "EXIT") {
        db.destroy();
    } else {
        db.query("SELECT * FROM products", (err, products) => {
            if (err) { throw err; }
            utils.showProducts(products);
            runInquirer(products);
        });
    }
}

async function runInquirer(choices) {
    let answer = await inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "Check our amazing items and buy what you like!\n",
            choices: choices.map(item => {
                return {
                    name: ` - ${item.product_name}, ${priceColor}PRICE:${reset} $${item.price}`,
                    value: item
                }
            })
        })
    handleProduct(answer.choice.id, answer.choice.price, answer.choice.stock_quantity);
}

async function handleProduct(itemId, itemPrice, itemQuantity) {
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
                if (itemQuantity === 0) {
                    console.log(`${outOfStock} Sorry! The item is out of stock! ${reset}`);
                    newPurchase();
                } else {
                    console.log(`${outOfStock} Sorry! We have only ${itemQuantity} items left.${reset}`);
                    newPurchase();
                }
            } else {
                let totalPrice = Math.round(itemPrice * answer.quantity * 100) / 100;
                console.log(`\n----------------------------------------------------------------- \nTotal price: ${priceColor} ${totalPrice} ${reset}`);
                storeTotal(totalPrice, itemId);
                console.log(thankForPurchColor, "Thank you for your purchase!", reset);
                newPurchase();
            }
        }
    )
}

async function newPurchase() {
    let choices = ["BACK TO THE STORE", "EXIT"];
    utils.handleExit(startShopping, db, choices);
}

function storeTotal(total, itemId) {
    db.query(
        "UPDATE products SET product_sales = product_sales + ? WHERE id = ?",
        [total, itemId],
        err => { if (err) throw err; }
    )
}
