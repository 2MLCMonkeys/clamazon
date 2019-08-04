let inquirer = require('inquirer');
let mySQL = require("mysql");

var connection = mySQL.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Azazel0315",
    database: ""
});

connection.connect(function(err){
    if (err) throw err;
    runInquirer();
});

function runInquirer(){
    inquirer
    .prompt({

    }).then(function(res){
        switch(res.action){
            case "":
                buyItem();
                break;
            
            case "exit":
                connection.end();
                break;
        }
    });
}