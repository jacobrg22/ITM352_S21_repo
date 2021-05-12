// "Jacob's Pokémon Card Shop" Assignment3 website by Jacob Graham 2021
// Programming based off of examples given by DAN PORT in Lab13 and Lab14 and with help from w3schools and NOAH KIM

// Setup server
var data = require('./public/products_data.js')
var products = data.products;
const queryString = require('query-string');
var myParser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var app = express();
var fs  = require('fs')

// Setup app.all
app.all('*', function (req, res, next) {
    console.log(req.method + ' to ' + req.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set userData equal to user_data.json
var userData = './user_data.json'; 

// Code from Lab14, modified for Assignment2
if(fs.existsSync(userData)) { 
    var file_stats = fs.statSync(userData);
    console.log(`${userData} has ${file_stats.size} characters.`);
    data = fs.readFileSync(userData, 'utf-8');
    users_reg_data = JSON.parse(data);
}
else {
    console.log(`${userData} does not exist!`)
}

// Thanks to NOAH KIM for giving guidance on the functions and statements
// Structure of process_login function from Lab14, modified for Assignment2
app.post('/process_login', function (req, res) {
    var errors = [];
    console.log(req.query);
    username = req.body.username.toLowerCase();
    // Check to see if info is defined
    if (typeof users_reg_data[username] != 'undefined') {
        // If info is good then redirect to invoice
        if (users_reg_data[username].password == req.body.password) {
            req.query.username = username;
            console.log(users_reg_data[req.query.username].name);
            req.query.name = users_reg_data[req.query.username].name;
            console.log(users_reg_data[req.query.username].email);
            req.query.email = users_reg_data[req.query.username].email;
            res.redirect('./invoice.html?' + queryString.stringify(req.query));
            return;
        }
        // Else push an error
        else {
            errors.push = ('Sorry, but the password you inputted is invalid!');  // Inform user that they inputted a wrong username
            console.log(errors);
            req.query.username = username;
            req.query.name = users_reg_data[username].name;
            req.query.errors = errors.join(';');
        }
    }
    // Else push an error
    else {
        errors.push = ('Sorry, but the username you inputted is invalid!'); // Inform user that they inputted a wrong username
        console.log(errors);
        req.query.username = username;
        req.query.errors = errors.join(';');
    }
    res.redirect('./login.html?' + queryString.stringify(req.query)); // Redirect to login page
});

// Thanks to NOAH KIM for giving guidance on the functions and statements
// Structure of process_register function from Lab14, modified for Assignment2
app.post("/process_register", function (req, res) {
    qstr = req.body
    console.log(qstr);
    var errors = [];
    // Setup character limitations (Letters only for name)
    if (/^[a-zA-Z]+$/.test(req.body.name)) {
    }
    else {
        errors.push('Please follow the format for names! (ex. John Smith)')
    }
    // If the entered name is empty, return an error
    if (req.body.name == "") {
        errors.push('The full name inputted is invalid.');
    }
    // Set a maximum fullname length of 30
    if ((req.body.fullname.length > 30 && req.body.fullname.length < 0)){ // Output errors if the name is too long
        errors.push('Sorry! That name is too long.')
    }
    // Check to see that the newly registered username is lower case
    var reguser = req.body.username.toLowerCase(); 
    if (typeof users_reg_data[reguser] != 'undefined') { // Output errors if name is taken
        errors.push('Sorry! That username is taken.') 
    }
    // Setup character limitations (Letters and numbers only for username)
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
    }
    else {
        errors.push('Please use only letters and numbers for your username.')
    }
  
    // Setup email limitations (from w3resource https://www.w3resource.com/javascript/form/email-validation.php)
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email)) {
    }
    else {
        errors.push('Please use a valid format email format (ex. johnsmith@gmail.com)')
    }

    // Make password a minimum of six characters
    if (req.body.password.length < 6) {
        errors.push('Your password is too short (Please use at least 6 characters).')
    }
    // Check to see if the passwords match
    if (req.body.password !== req.body.repeat_password) { 
        errors.push('Your password does not match.')
    }

    // Request fullname, username, and email
    req.query.fullname = req.body.fullname;
    req.query.username = req.body.username;
    req.query.email = req.body.email;

    // Remember user information given no errors
    if (errors.length == 0) {
        POST = req.body;
        console.log('no errors');
        var username = POST["username"];
        users_reg_data[username] = {};
        users_reg_data[username].name =  req.body.fullname;
        users_reg_data[username].password =  req.body.password;
        users_reg_data[username].email =  req.body.email;
        data = JSON.stringify(users_reg_data); // Stringify user's info
        fs.writeFileSync(userData, data, "utf-8");
        res.redirect('./invoice.html?' + queryString.stringify(req.query));
    }
    // Check for errors
    else {
        console.log(errors)
        req.query.errors = errors.join(';');
        res.redirect('register.html?' + queryString.stringify(req.query)); // Redirect to register.html
    }
});

// Derived from Lab 14 and Assigment2 screencast by DAN PORT
// Take form and process it given that the information submitted is ok
app.post("/process_cart", function (req, res) {
    let POST = req.body;
    console.log(POST)
    if (typeof POST['purchase_submit'] != 'undefined') {
        var hasValidQty = true; // Assume that quantity is valid
        var hasQty = false;
        product_key = POST["product_key"];
        products = products[product_key];
        for (i = 0; i < products.length; i++) {
            qtyCheck = POST[`quantity${i}`]; // Set qtyCheck equal to POST[`quantity${i}`]
            if (qtyCheck > 0) {
                hasQty = true // Has non-zero quantity
            }
            if (isNonNegInt(qtyCheck) == false) {
                hasValidQty = false // Has both valid quantity and non-negative integer
            }
        }
        if (hasValidQty) {
            if (typeof req.session.cart == "undefined") {
                req.session.cart = {};
            }
            req.session.cart[product_key] = quantities;
            POST["message"] = "Successfully added to cart!";
        } 
        else {
            POST["message"] = "Oops! We couldn't add that to the cart!";
        }
        const stringified = queryString.stringify(POST);
        console.log(req.session);
        res.redirect(`./products_display.html?${stringified}`);
    }
});

// isNonNegInt function from Lab11
// Check to see if the quantity inputted is valid
function isNonNegInt(q, return_errors = false) {
    var errors = []; // Assume no errors at first
    if(q == '') q = 0; // If text box is blank, show nothing
    if (Number(q) != q) errors.push('<font color="red">Please input a number </font>'); // Check if string is a number value
    else {
        if (q < 0) errors.push('<font color="red">Please input a positive quantity </font>'); // Check if it is non-negative
        if (parseInt(q) != q) errors.push('<font color="red">Please input a whole number </font>'); // Check that it is an integer
    }
    return return_errors ? errors : (errors.length == 0);
}

app.use(express.static('./public')); // Use express.static

app.listen(8080, () => console.log(`
    listening on port 8080
    access here: http://itm-vm.shidler.hawaii.edu:8080/
`)); // Output to console the port we are listening in on