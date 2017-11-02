// =============================================================================

// Initial npm packages

// =============================================================================
const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

// Initialize connection to MYSQL database.
const connection = mysql.createConnection({
    host    : "localhost",
    port    : 3306,
    user    : "root",
    password: "root",
    database: "bamazon"
});

// Create the connection to the server & load products.
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    loadProducts();
})
