const inquirer = require("inquirer");
const cTable = require("console.table");

function showProducts(products) {
    let productsRows = products.map(product => {
        return {
            id: product.id,
            name: product.product_name,
            department: product.department_name,
            price: product.price,
            quantity: product.stock_quantity
        };
    });
    console.table(productsRows);
}

async function handleExit(operation, db, choises) {
    let answer = await inquirer
        .prompt({
            name: "answer",
            type: "list",
            message: " ",
            choices: choises
        });
    if (answer.answer === "EXIT") {
        db.destroy();
    } else {
        operation();
    }
}

module.exports = {
    handleExit,
    showProducts
};