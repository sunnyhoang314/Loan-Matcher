var express = require('express');//Imports the Express library
var session = require('express-session');//Imports a library for managing user sessions, which store data across multiple requests from the same user (e.g., keeping users logged in).
var cookie = require('cookie-parser');//Imports a library for working with cookies. Cookies are small data pieces stored on the user's browser that your server can read, such as user preferences or authentication tokens.
var path = require('path');//Imports Node.js's built-in module for working with file paths. Helps ensure paths work across different operating systems.
var ejs = require('ejs');//Imports the EJS templating engine, which lets you write HTML pages with embedded JavaScript for dynamic content (like displaying a user’s name).
var bodyParser = require('body-parser');//Imports Body Parser, a middleware for parsing incoming data (e.g., form submissions or JSON payloads) so your app can work with it.
const http = require('http');//Imports Node.js's built-in HTTP module to create and manage web servers.

var db = require('./models/db_controller');
//Imports the route controllers
var signup =  require('./controllers/signup');
var login = require('./controllers/login');
const loggedIn = require('./controllers/loggedIn');

var app = express();//Creates an instance of the Express app. This is your web server, which will handle requests and send responses.

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Directory for templates


// Serve static files from the 'public' directory
app.use(express.static('./public/login-signup'));

// Middleware for parsing incoming data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware for handling cookies
app.use(cookie());

//create server for app
const server = http.createServer(app);

// Middleware for handling sessions
app.use(
  session({
    secret: 'dksajfkdj', // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);


// Redirect root URL to /signup-login/index.html
app.get('/', loggedIn,(req, res) => {
    if(!req.session.loggedIn) return res.send ('You are not logged in');
});

app.get('/client-main', loggedIn, (req, res) => { 
    res.render('client-main', { 
        email: req.session.email
    }); // Pass dynamic data to the template
});


app.get('/loan-provider-main', loggedIn, (req, res) => {
    res.render('loan-provider-main', { 
        email: req.session.email 
    }); // Pass dynamic data to the template
});

// Integrate the routers
app.use('/signup',signup);
app.use('/login', login);

// Starts the Express server on port 3000.
const PORT = 3000;
server.listen(PORT, () => {
    const link = `http://localhost:${PORT}`;
    console.log(`Server is running on ${link}`);
});
