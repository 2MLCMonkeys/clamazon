require("dotenv").config();

let inquirer = require('inquirer');
let mySQL = require("mysql");
let keys = require("./keys.js");
let colors = require('colors/safe');
let Table = require('cli-table');

let MySQL = (keys.MySQL.password);

var connection = mySQL.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: MySQL,
    database: "clamazon_db",
    pager: "less -SFX"
});


connection.connect(function (err) {
    if (err) throw err;
    runInquirer();
});




function runInquirer() {
    inquirer
        .prompt([{
            name: "menu",
            type: "list",
            message: "What would you like to do?:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
        }
        ]).then(function (res) {
            console.log(colors.grey("----------------------------------------------------------------------"));
            let input = res.menu;
            if (input === "View Products for Sale") {
                viewProducts();

            }
            else if (input === "View Low Inventory") {
                checkInventory();
            }
            else if (input === "Add to Inventory") {
                addInventory();
            }
            else if (input === "Add New Product") {
                addProduct();
            }
            else if (input === "Quit"){
                connection.end;
            }
            else if (!input) {
                console.log("Please enter an ID");
                runInquirer();
            }

        });
};


function viewProducts() {
    connection.query("SELECT * FROM products",
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
            table.push(
                [colors.cyan('Item ID#'), colors.cyan('Product Name'), colors.cyan('Department'), colors.cyan('Price'), colors.cyan("Stock Quantity")]
            );

            for (var i = 0; i < res.length; i++) {

                table.push(
                    [colors.cyan(res[i].Item_ID), res[i].Product_Name, res[i].Department_Name, '$' + res[i].Purchase_Price, res[i].Stock_Quantity]
                );
            }
            console.log(table.toString());
            console.log(colors.grey("----------------------------------------------------------------------"));
            runInquirer();
        })
};

function checkInventory() {
    connection.query("SELECT * FROM products WHERE Stock_Quantity <= 5", function start(err, res, fields) {
        if (err) throw err;
        var table = new Table({
            chars: {
                'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                , 'right': '║', 'right-mid': '╢', 'middle': '│'
            }
        });
        table.push(
            [colors.cyan('Item ID#'), colors.cyan('Product Name'), colors.cyan('Department'), colors.cyan('Price'), colors.cyan('Stock Quantity')]
        );

        for (var i = 0; i < res.length; i++) {
            table.push(
                [colors.cyan(res[i].Item_ID), res[i].Product_Name, res[i].Department_Name, '$' + res[i].Purchase_Price, res[i].Stock_Quantity]
            );
        }
        console.log(table.toString());
        console.log(colors.grey("----------------------------------------------------------------------"));
        runInquirer();

    });

};

function addInventory() {
    connection.query("SELECT * FROM products", function start(err, res, fields) {
        if (err) throw err;
        inquirer
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


                connection.query(
                    "UPDATE products SET ? WHERE ?", [{ Stock_Quantity: parseInt(chosenProduct.Stock_Quantity) + parseInt(answer.amount) }, { Product_Name: chosenProduct.Product_Name }],
                    function (err) {
                        if (err) throw err;
                        console.log(colors.magenta("Added " + answer.amount + " to " + answer.id + " inventory"));
                        console.log(colors.grey("----------------------------------------------------------------------"));
                        runInquirer();
                    }
                );
            });
    });
};

function addProduct() {
    inquirer
        .prompt([{
            name: "product",
            type: "input",
            message: "What is the name of the new product being added?"
        },
        {
            name: "department",
            type: "list",
            message: "Which department would you like to add your product to?",
            choices: ["Decor", "Baby", "Home and Garden", "Beauty and Health", "Clothing", "Pets", "Electronics"]
        },
        {
            name: "amount",
            type: "input",
            message: "How many products are you adding to the inventory?",
            validate: function (amount) {
                if (isNaN(amount) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "price",
            type: "input",
            message: "What is the cost of the new inventory?",
            validate: function (price) {
                if (isNaN(price) === false) {
                    return true;
                }
                return false;
            }
        }
        ]).then(function (answer) {
            let stock = answer.amount;
            let cost = answer.price;
            let item = answer.product;
            console.log(colors.grey("----------------------------------------------------------------------"));

            var queryString = "INSERT INTO products SET ?";
            connection.query(queryString, {
                Product_Name: answer.product,
                Department_Name: answer.department,
                Purchase_Price: cost,
                Stock_Quantity: stock || 0
            },
                function (err) {
                    if (err) throw err;
                    console.log(colors.magenta("Your new product " + item + " has been added to the inventory!"));
                    console.log(colors.grey("----------------------------------------------------------------------"));
                    runInquirer();
                }
            );
            });

};
