const mysql = require("mysql");
const inquirer = require("inquirer");

const priceColor = '\033[0;34m';
const outOfStock = '\033[0;31m';
const thankForPerchColor = '\033[0;32m';
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
        db.query("SELECT * FROM products", (err, choices) => {
            if (err) { throw err; }
            runInquirer(choices);
        })
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
                console.log(outOfStock, "Sorry! The item is out of stock!", reset);
                newPurchase();
            } else {
                let totalPrice = itemPrice * answer.quantity;
                console.log(`\n----------------------------------------------------------------- \nTotal price: ${priceColor} ${totalPrice} ${reset}`);
                storeTotal(totalPrice, itemId);
                console.log(thankForPerchColor, "Thank you for your purchase!", reset);
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

function storeTotal(total, itemId) {
    db.query(
        "UPDATE products SET product_sales = product_sales + ? WHERE id = ?",
        [total, itemId],
        err => { if (err) throw err; }
    )
}


