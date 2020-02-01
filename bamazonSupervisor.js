const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

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
                + "\nYou are in Bamazon Supervisor mode. Choose the command below:\n"
                + "-----------------------------------------------------------------\n",
            choices: [
                { name: "Sales by Department", value: 0 },
                { name: "Create New Department", value: 1 },
                { name: "EXIT", value: 2 }
            ]
        })

    switch (command.answer) {
        case 0:
            showDepart();
            break;
        case 1:
            createDepart();
            break;
        case 2:
            db.destroy();
            break;
    }
}

function showDepart() {
    db.query("SELECT department_id, departments.department_name, over_head_cost, SUM(product_sales) AS product_sales, " +
        "SUM(product_sales) - over_head_cost AS total_profit " +
        "FROM departments INNER JOIN products ON departments.department_name = products.department_name " +
        "GROUP BY department_id", (err, items) => {
            if (err) { throw err; }
            console.log(items);
            let itemsArr = [];
            items.forEach(item => {
                const itemObj =
                {
                    department_id: item.department_id,
                    department_name: item.department_name,
                    over_head_cost: item.over_head_cost,
                    product_sales: item.product_sales,
                    total_profit: item.total_profit

                };
                itemsArr.push(itemObj);
            });

            console.table(itemsArr);
        });

}