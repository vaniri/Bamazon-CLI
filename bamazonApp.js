const mysql = require("mysql");
const inquirer = require("inquirer");

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "",
    password: "",
    database: "bamazon_db"
  });

  db.connect();

  db.query("SELECT * FROM products", (err, choices) => {
    if (err) throw err;
    runUnquirer(choices);

  });

  function runUnquirer(choices){
  inquirer 
  .prompt ({
      name: "choice",
      type: "list",
      message: "Welcome to the Bamazon! Check your amazing items and buy what you like!",
      choices: choices.map(item => { return {
          name: `${item.product_name} price: ${item.price}`,
          value: item.id
      }})
  })
  .then(answer => {
    console.log(answer.choice);
  })
}