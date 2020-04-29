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
        .prompt([
            {
                message: "What would you like to do?",
                type: "list",
                choices: ["View Product Sales by Department", "Create New Department", "Quit"],
                name: "menu"
            }
        ]).then(function (res) {
            switch (res.menu) {
                case "View Product Sales by Department":
                    viewSales();
                    break;
                case "Create New Department":
                    createDept();
                    break;
                case "Quit":
                    console.log("Have a nice day!");
                    connection.end();
                    break;
            }
        }).catch(function (err) {
            console.log(err);
        })
}

// function to add a new department
function createDept() {
    inquirer
        .prompt([
            {
                message: "What department would you like to add?",
                name: "newDept",
                validate: function (value) {
                    if (isNaN(value) === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                message: "What are the department's overhead costs?",
                name: "deptCosts",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
        ]).then(function (ans) {
            connection.query("INSERT INTO departments SET ?",
                {
                    department_name: ans.newDept,
                    over_head_costs: parseFloat(ans.deptCosts)
                },
                function (error, response) {
                    if (error) throw error;
                    viewSales();
                })
        }).catch(function (error) {
            console.log(error);
        })
};

// function that joins the products and departments tables to produce a combined view - includes aliases to display calculated values
function viewSales() {
    connection.query("SELECT departments.Department_ID,departments.Department_Name,SUM(departments.Over_Head_Costs) AS Total_Costs,SUM(products.Product_Sales) AS Total_Sales,(SUM(products.Product_Sales)-SUM(departments.Over_Head_Costs)) AS Total_Profit FROM departments LEFT JOIN products ON departments.Department_Name = products.Department_Name GROUP BY Department_ID",

        // CREATES TABLE FOR DEPARTMENT SALES //
        function (err, res) {
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
                [colors.cyan('Department ID#'), colors.cyan('Department Name'), colors.cyan('Overhead Costs'), colors.cyan('Product Sales'), colors.cyan("Total Profit")]
            );

            // ITERATES THROUGH ALL ITEMS AND FILLS TABLE WITH ALL RELEVANT INFORMATION FROM DATABASE //
            for (var i = 0; i < res.length; i++) {
                table.push(
                    [colors.cyan(res[i].Department_ID), res[i].Department_Name, "$" + res[i].Total_Costs, '$' + res[i].Total_Sales, "$" + res[i].Total_Profit]
                );
                }
                console.log(table.toString());
                console.log(colors.grey("----------------------------------------------------------------------"));
    
                // PROMPTS WITH SUPERVISOR SELECTION //
                runInquirer();
            })
};