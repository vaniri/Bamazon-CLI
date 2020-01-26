const mysql = require("mysql");
const inquirer = require("inquirer");

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

db.query("SELECT * FROM products", (err, choices) => {
    if (err) throw err;
    runInquirer(choices);

});

function runInquirer(choices) {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "Welcome to the Bamazon! Check your amazing items and buy what you like!",
            choices: choices.map(item => {
                return {
                    name: `${item.product_name} price: ${item.price}`,
                    value: item.id
                }
            })
        })
        .then(answer => {
            handleProduct(answer.choice);
        })
}

function handleProduct (itemId) {
    inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: "How many units would you like to buy?",
        })
        .then(answer => {
            console.log(answer.quantity);
            db.query(
                "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", 
                [ answer.quantity, itemId ],
                err => {
                    if (err) throw err;
                    console.log("Thank you for your purchase!");
                }
                )
        })
    }
