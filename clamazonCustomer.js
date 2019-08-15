//cached password
require("dotenv").config();
//global required node modules
let inquirer = require('inquirer');
let mySQL = require("mysql");
let keys = require("./keys.js");
let colors = require('colors/safe');
let Table = require('cli-table');
//variable for password
let MySQL = (keys.MySQL.password);
//connection to MySQL database
var connection = mySQL.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: MySQL,
    database: "clamazon_db",
    pager: "less -SFX"
});

//intial connection function and displays table of entire table in database called. 
connection.connect(function(err){
    if(err) throw err;
    connection.query("SELECT Item_ID, Product_Name, Department_Name, Purchase_Price FROM products", function start(err, res, fields) {
        if (err) throw err;
        //creates cl-table
        var table = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                   , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                   , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                   , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
          });
          table.push(
              [colors.cyan('Item ID#'), colors.cyan('Product Name'), colors.cyan('Department'), colors.cyan('Price')]
          );
           //pushes each item to table 
          for (var i = 0; i < res.length; i++) {            
              table.push(
                  [colors.cyan(res[i].Item_ID), res[i].Product_Name, res[i].Department_Name, '$' +res[i].Purchase_Price]
                  );
        }
        console.log(table.toString());
        console.log(colors.grey("----------------------------------------------------------------------"));
        runInquirer();
    });
});


//intial inquirer to pick an id in the above table and runs next inquirer to purchase product picked
function runInquirer() {
    inquirer
        .prompt([{
            name: "product",
            type: "input",
            message: "Please enter product ID to select:"
        }
        ]).then(function (res) {
            console.log(colors.grey("----------------------------------------------------------------------"));
            let input = res.product;
            purchaseProduct(input);
            //if no input into inquirer it will ask again
            if (!input) {
                console.log("Please enter an ID");
                runInquirer();
            }

        });
}

function purchaseProduct(input) {
    //connection to database pulling back specific item user would like and displays
    connection.query("SELECT * FROM products WHERE Item_ID LIKE ?", [input],
        function (err, res) {
            if (err) throw err;
            console.log(colors.magenta("Your Selction: ") + colors.cyan("ID#: ") + res[0].Item_ID + colors.cyan(" | Product: ") + res[0].Product_Name + colors.cyan(" | Department: ") + res[0].Department_Name + colors.cyan(" | Price: ") + res[0].Purchase_Price);
            console.log(colors.grey("----------------------------------------------------------------------"));
            //inquirer run to ask how many the user would like to purchase
            function purchaseInquirer() {
                let quantity = res[0].Stock_Quantity;
                let ID = res[0].Item_ID;
                let price = res[0].Purchase_Price;
                inquirer
                    .prompt([{
                        name: "purchase",
                        type: "input",
                        message: "You've selected " + res[0].Product_Name + ", how many would you like to purchase? (E to go back to selection)"
                    }]).then(function (res) {
                        console.log(colors.grey("----------------------------------------------------------------------"));
                        let selection = res.purchase;
                        let cost = price * selection
                        //checks quantity against how many the user would like and returns insufficient if not enough
                        if (quantity < selection) {
                            console.log(colors.green("Insufficient quantity!"));
                            purchaseInquirer();
                        }
                        else if (selection < quantity) {
                            let difference = quantity - selection;
                            //updates database with removed purchased product
                            connection.query("UPDATE products SET ? WHERE ?",
                                [{
                                    Stock_Quantity: difference
                                },
                                {
                                    Item_ID: ID
                                }],
                                function (error) {
                                    if (error) throw err;
                                    console.log(colors.magenta("Purchased successfully, your purchase cost: ") +colors.green("$" + cost));
                                    connection.end();
                                })
                        }
                        else if (selection === "E" || selection === "e") {
                            runInquirer();
                        }


                    })
            };
            purchaseInquirer();
        })
};