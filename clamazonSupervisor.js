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
}