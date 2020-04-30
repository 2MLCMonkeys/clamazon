// DEPENDENCIES //
require("dotenv").config();

// GLOBAL REQUIRED NODE MODULES //
let inquirer = require('inquirer');
let mySQL = require("mysql");
let keys = require("./keys.js");
let colors = require('colors/safe');
let Table = require('cli-table');

// PASSWORD VARIABLE //
let MySQL = (keys.MySQL.password);

// CONNECTION TO MYSQL DATABASE //
var connection = mySQL.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: MySQL,
    database: "clamazon_db",
    pager: "less -SFX"
});

// INITIAL DATABASE CONNECTION //
connection.connect(function (err) {
    if (err) throw err;

    // STARTS INQUIRER //
    runInquirer();
});



// INQUIRER //
function runInquirer() {
    inquirer

        // SELECTION FOR MANAGER //
        .prompt([{
            name: "menu",
            type: "list",
            message: "What would you like to do?:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
        }

            // SENDS SELECTION TO CORRECT FUNCTION //
        ]).then(function (res) {
            console.log(colors.grey("----------------------------------------------------------------------"));
            switch (res.menu) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    checkInventory();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addProduct();
                    break;
                case "Quit":
                    console.log("Have a nice day!");
                    connection.end();
                    break;
            }
        });
};

// VIEWS ALL INVENTORY //
function viewProducts() {
    connection.query("SELECT * FROM products",

        // CREATES TABLE FOR PRODUCTS //
        function start(err, res, fields) {
            if (err) throw err;
            var table = new Table({
                chars: {
                    'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                    , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                    , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                    , 'right': '║', 'right-mid': '╢', 'middle': '│'
                }
            });

            // SPECIFIES WHERE DATA FROM DATABASE IS PLACED IN TABLE //
            table.push(
                [colors.cyan('Item ID#'), colors.cyan('Product Name'), colors.cyan('Department'), colors.cyan('Price'), colors.cyan("Stock Quantity")]
            );

            // ITERATES THROUGH ALL ITEMS AND FILLS TABLE WITH ALL RELEVANT INFORMATION FROM DATABASE //
            for (var i = 0; i < res.length; i++) {

                table.push(
                    [colors.cyan(res[i].Item_ID), res[i].Product_Name, res[i].Department_Name, '$' + res[i].Purchase_Price, res[i].Stock_Quantity]
                );
            }
            console.log(table.toString());
            console.log(colors.grey("----------------------------------------------------------------------"));

            // PROMPTS WITH MANAGER SELECTION //
            runInquirer();
        })
};

// CHECK INVENTORY FUNCTION //
function checkInventory() {
    connection.query("SELECT * FROM products WHERE Stock_Quantity <= 5", function start(err, res, fields) {
        if (err) throw err;

        // CREATES TABLE //
        var table = new Table({
            chars: {
                'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                , 'right': '║', 'right-mid': '╢', 'middle': '│'
            }
        });

        // SPECIFIES WHERE DATA FROM DATABASE IS PLACED IN TABLE //
        table.push(
            [colors.cyan('Item ID#'), colors.cyan('Product Name'), colors.cyan('Department'), colors.cyan('Price'), colors.cyan('Stock Quantity')]
        );

        // ITERATES THROUGH ALL ITEMS AND FILLS TABLE WITH ALL RELEVANT INFORMATION FROM DATABASE IF INVENTORY IS LESS THAN 5 IT WILL BE DISPLAYED ON TABLE//
        for (var i = 0; i < res.length; i++) {
            table.push(
                [colors.cyan(res[i].Item_ID), res[i].Product_Name, res[i].Department_Name, '$' + res[i].Purchase_Price, res[i].Stock_Quantity]
            );
        }
        console.log(table.toString());
        console.log(colors.grey("----------------------------------------------------------------------"));

        // PROMPTS WITH MANAGER SELECTION //
        runInquirer();

    });

};

// ADD INVENTORY //
function addInventory() {
    connection.query("SELECT * FROM products", function start(err, res, fields) {
        if (err) throw err;

        // INQUIRER PROMPT FOR ADD INVENTORY //
        inquirer

            // WHICH CURRENT PRODUCT BEING ADDED //
            .prompt([{
                name: "id",
                type: "list",
                message: "Which product would you like to add inventory to?",
                choices: function () {
                    var choiceArray = [];
                    for (var j = 0; j < res.length; j++) {
                        choiceArray.push(res[j].Product_Name);
                    }
                    return choiceArray;
                }
            },

            // HOW MANY OF PRODUCT BEING ADDED //
            {
                name: "amount",
                type: "input",
                message: "How many products are you adding to the inventory?"
            }
            ]).then(function (answer) {
                var chosenProduct;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].Product_Name === answer.id) {
                        chosenProduct = res[i];
                    }
                }

                // UPDATES DATABASE WITH NEW PRODUCT AMOUNT //
                connection.query(
                    "UPDATE products SET ? WHERE ?", [{ Stock_Quantity: parseInt(chosenProduct.Stock_Quantity) + parseInt(answer.amount) }, { Product_Name: chosenProduct.Product_Name }],
                    function (err) {
                        if (err) throw err;
                        console.log(colors.magenta("Added " + answer.amount + " to " + answer.id + " inventory"));
                        console.log(colors.grey("----------------------------------------------------------------------"));

                        // PROMPTS MANAGER SELECTION //
                        runInquirer();
                    }
                );
            });
    });
};

// ADDING NEW PRODUCT TO DATABASE //
function addProduct() {
    inquirer

        // NAME OF NEW PRODUCT //
        .prompt([{
            name: "product",
            type: "input",
            message: "What is the name of the new product being added?"
        },

        // WHICH CURRENT DEPARTMENT NEW PRODUCT BELONGS TO //
        {
            name: "department",
            type: "list",
            message: "Which department would you like to add your product to?",
            choices: ["Decor", "Baby", "Home and Garden", "Beauty and Health", "Clothing", "Pets", "Electronics"]
        },

        // PRODUCT INVENTORY TO BE ADDED //
        {
            name: "amount",
            type: "input",
            message: "How many products are you adding to the inventory?",

            // VALIDATES ITS A TRUE AMOUNT //
            validate: function (amount) {
                if (isNaN(amount) === false) {
                    return true;
                }
                return false;
            }
        },

        // COST OF NEW PRODUCT //
        {
            name: "price",
            type: "input",
            message: "What is the cost of the new inventory?",

            // VALIDATES ITS A TRUE AMOUNT //
            validate: function (price) {
                if (isNaN(price) === false) {
                    return true;
                }
                return false;
            }
        }

            // CREATES OBJECT FROM INQUIERER TO BE PLACED IN DATABASE //
        ]).then(function (answer) {
            let stock = answer.amount;
            let cost = answer.price;
            let item = answer.product;
            console.log(colors.grey("----------------------------------------------------------------------"));

            // CONNECTS TO DATABASE AND INSERTS NEW PRODUCT OBJECT //
            var queryString = "INSERT INTO products SET ?";
            connection.query(queryString, {
                Product_Name: answer.product,
                Department_Name: answer.department,
                Purchase_Price: cost,
                Stock_Quantity: stock || 0,
                Product_Sales: 0.00
            },

                // ALERTS MANAGER IF THERE WAS AN ERROR OR IF THE PRODUCT WAS ADDED TO THE INVENTORY //
                function (err) {
                    if (err) throw err;
                    console.log(colors.magenta("Your new product " + item + " has been added to the inventory!"));
                    console.log(colors.grey("----------------------------------------------------------------------"));

                    // PROMPTS MANAGER SELECTION //
                    runInquirer();
                }
            );
        });

};
