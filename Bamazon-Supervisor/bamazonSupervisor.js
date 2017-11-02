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
    makeTable();
});

function makeTable() {
  // Displaying an initial list of products for the user, calling promptSupervisor
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    promptSupervisor();
  });
}

function promptSupervisor() {
  // Giving the user some options for what to do next
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department", "Quit"]
      }
    ])
    .then(function(val) {
      // Checking to see what option the user chose and running the appropriate function
      if (val.choice === "View Product Sales by Department") {
        viewSales();
      }
      else if (val.choice === "Create New Department") {
        addDepartment();
      }
      else {
        console.log("Goodbye!");
        process.exit(0);
      }
    });
}

function addDepartment() {
  // Asking the user about the department they would like to add
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the department?"
      },
      {
        type: "input",
        name: "overhead",
        message: "What is the overhead cost of the department?",
        validate: function(val) {
          return val > 0;
        }
      }
    ])
    .then(function(val) {
      connection.query(
        "INSERT INTO departments (department_name,over_head_costs) VALUES (?, ?)",
        [val.name, val.overhead],
        function(err) {
          if (err) throw err;
          console.log("ADDED DEPARTMENT!");
          makeTable();
        }
      );
    });
}

function viewSales() {
  // Selects a few columns from the departments table, calculates a total_profit column
  connection.query(
    "SELECT departProd.department_id, departProd.department_name, departProd.over_head_costs, SUM(departProd.product_sales) as product_sales, (SUM(departProd.product_sales) - departProd.over_head_costs) as total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM products JOIN departments ON products.department_name = departments.department_name) as departProd GROUP BY department_id",
    function(err, res) {
      console.table(res);
      promptSupervisor();
    }
  );
}
