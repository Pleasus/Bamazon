// variables defined to require certain modules needed for the app
var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');

// set up the connection to the MySQL server
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "Tuber007!", //Your password
    database: "bamazon_db"
})

// function that holds the table parameters, inquirer functionality, and 
// console.log for the displayed information
var buyProducts = function() {

	// begin to query the server for all of the information in the products table
    connection.query('SELECT * FROM products', function(err, res) {
        
        //define the table created using the cli-table module
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity']
        });

        //console.log the table introduction statement 
        console.log("");
        console.log("HERE'S WHAT'S FOR SALE: ");
        console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");

        // for loop tho run through all of the information from the table
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity]);
        }
        // console.log the table itself after the info is ready 
        console.log(table.toString());

        // inquirer prompt to get user input for item the user wants to buy
        // and how many they want to buy
        inquirer.prompt([{
            name: "itemId",
            type: "input",
            message: "What item would you like to buy? (Item ID)",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "Quantity",
            type: "input",
            message: "How many do you want? (numbers only)",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }

        // begin the function that uses the information defined by the inquirer answers
        }]).then(function(answer) {

        	// define the variables used for displaying purchase information
            var chosenId = answer.itemId - 1
            var chosenProduct = res[chosenId]
            var chosenQuantity = answer.Quantity

            // if/then that evaluates whether there is enough stock for the user to purchase
            // if there is, display what was ordered, if not, respond with a "sorry" statement
            if (chosenQuantity < res[chosenId].stock_quantity) {
            	console.log("");
            	console.log("----------------------------------------------------------------");
                console.log("Your total for " + answer.Quantity + " x " + res[chosenId].product_name + " is: $" + res[chosenId].price.toFixed(2) * chosenQuantity);
                console.log("----------------------------------------------------------------");
                console.log("");
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: res[chosenId].stock_quantity - chosenQuantity
                }, {
                    item_id: res[chosenId].item_id
                }], function(err, res) {
                    if(err) throw err;
                    buyProducts();
                });

            } else {
            	console.log("");
            	console.log("----------------------------------------------------------------");
                console.log("Sorry, not enough for your purchase at this time. There are only " + res[chosenId].stock_quantity + " left.");
                console.log("----------------------------------------------------------------");
                console.log("");
                buyProducts();
            }
        })
    })
}

// run the buyProducts function
buyProducts();