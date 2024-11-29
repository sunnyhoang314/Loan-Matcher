var express = require('express');//Imports the Express library
var session = require('express-session');//Imports a library for managing user sessions, which store data across multiple requests from the same user (e.g., keeping users logged in).
var cookie = require('cookie-parser');//Imports a library for working with cookies. Cookies are small data pieces stored on the user's browser that your server can read, such as user preferences or authentication tokens.
var path = require('path');//Imports Node.js's built-in module for working with file paths. Helps ensure paths work across different operating systems.
var ejs = require('ejs');//Imports the EJS templating engine, which lets you write HTML pages with embedded JavaScript for dynamic content (like displaying a user’s name).
var multer = require('multer');//Imports Multer, a library for handling file uploads in forms, like uploading images or documents.
var crypto = require('crypto');//Imports Node.js's built-in Crypto module, used for cryptographic tasks like generating random tokens or encrypting passwords.
const { check, validationResult } = require('express-validator'); // Updated express-validator
var sweetalert = require('sweetalert2');//Imports SweetAlert2, a library for creating beautiful alert popups in the browser (e.g., "Are you sure you want to delete this?").
var bodyParser = require('body-parser');//Imports Body Parser, a middleware for parsing incoming data (e.g., form submissions or JSON payloads) so your app can work with it.
const http = require('http');//Imports Node.js's built-in HTTP module to create and manage web servers.
var db = require('./models/db_controller');

var signup =  require('./controllers/signup');//Imports the signup controller route, which handles user registration and authentication.


var app = express();//Creates an instance of the Express app. This is your web server, which will handle requests and send responses.

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('./public'));

// Middleware for parsing incoming data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware for handling cookies
app.use(cookie());

//create server for app
const server = http.createServer(app);

// // Middleware for handling sessions
// app.use(
//   session({
//     secret: 'your-secret-key', // Replace with a secure secret key
//     resave: false,
//     saveUninitialized: true,
//   })
// );


// Redirect root URL to /signup-login/index.html
app.get('/', (req, res) => {
    res.redirect('/login-signup/index.html');
  });

// Integrate the signup router
app.use('/signup',signup)

// Starts the Express server on port 3000.
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    const link = `http://localhost:${PORT}`;
    console.log(`Server is running on ${link}`);
});
