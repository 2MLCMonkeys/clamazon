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
};