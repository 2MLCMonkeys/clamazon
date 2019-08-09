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


connection.connect(function(err){
    if(err) throw err;
    connection.query("SELECT Item_ID, Product_Name, Department_Name, Purchase_Price FROM products", function start(err, res, fields) {
        if (err) throw err;
        var table = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                   , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                   , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                   , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
          });
          table.push(
              [colors.cyan('Item ID#'), colors.cyan('Product Name'), colors.cyan('Department'), colors.cyan('Price')]
          );
           
          for (var i = 0; i < res.length; i++) {
            //   console.log(colors.grey("----------------------------------------------------------------------"));
            //   console.log(colors.cyan("ID#: ") + res[i].Item_ID + colors.cyan(" | Product: ") + res[i].Product_Name + colors.cyan(" | Department: ") + res[i].Department_Name + colors.cyan(" | Price: ") + "$" + res[i].Purchase_Price);
              table.push(
                  [colors.cyan(res[i].Item_ID), res[i].Product_Name, res[i].Department_Name, '$' +res[i].Purchase_Price]
                  );
        }
        console.log(table.toString());
        console.log(colors.grey("----------------------------------------------------------------------"));
        runInquirer();
    });
});



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
            if (!input) {
                console.log("Please enter an ID");
                runInquirer();
            }

        });
}

function purchaseProduct(input) {
    connection.query("SELECT * FROM products WHERE Item_ID LIKE ?", [input],
        function (err, res) {
            if (err) throw err;
            console.log(colors.magenta("Your Selction: ") + colors.cyan("ID#: ") + res[0].Item_ID + colors.cyan(" | Product: ") + res[0].Product_Name + colors.cyan(" | Department: ") + res[0].Department_Name + colors.cyan(" | Price: ") + res[0].Purchase_Price);
            console.log(colors.grey("----------------------------------------------------------------------"));

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

                        if (quantity < selection) {
                            console.log(colors.green("Insufficient quantity!"));
                            purchaseInquirer();
                        }
                        else if (selection < quantity) {
                            let difference = quantity - selection;

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