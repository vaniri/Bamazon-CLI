const inquirer = require("inquirer");

async function newOperation(operation, db) {
    let answer = await inquirer
        .prompt({
            name: "answer",
            type: "list",
            message: " ",
            choices: ["NEW OPERATION", "EXIT"]
        });

    if (answer.answer === "EXIT") {
        db.destroy();
    } else {
        operation();
    }
}

module.exports = {
    newOperation
};