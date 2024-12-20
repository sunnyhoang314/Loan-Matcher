var express = require('express');//Imports the Express library
var session = require('express-session');//Imports a library for managing user sessions, which store data across multiple requests from the same user (e.g., keeping users logged in).
var cookie = require('cookie-parser');//Imports a library for working with cookies. Cookies are small data pieces stored on the user's browser that your server can read, such as user preferences or authentication tokens.
var path = require('path');//Imports Node.js's built-in module for working with file paths. Helps ensure paths work across different operating systems.
var ejs = require('ejs');//Imports the EJS templating engine, which lets you write HTML pages with embedded JavaScript for dynamic content (like displaying a user’s name).
var bodyParser = require('body-parser');//Imports Body Parser, a middleware for parsing incoming data (e.g., form submissions or JSON payloads) so your app can work with it.
const http = require('http');//Imports Node.js's built-in HTTP module to create and manage web servers.
const WebSocket = require('ws'); // WebSocket package for server-client communication

var db = require('./models/db_controller');
//Imports the route controllers
var signup =  require('./controllers/signup');
var login = require('./controllers/login');
const loggedIn = require('./controllers/loggedIn');
var createPost = require('./controllers/createPost');
var createOffer = require('./controllers/createOffer');

var app = express();//Creates an instance of the Express app. This is your web server, which will handle requests and send responses.

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Directory for templates


// Serve static files from the 'public' directory


// Middleware for parsing incoming data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware for handling cookies
app.use(cookie());

//create server for app
const server = http.createServer(app);

// Configure session middleware
app.use(
    session({
        secret: 'your-secret-key', // A secret key for signing the session ID cookie
        resave: false, // Don't save session if it was not modified
        saveUninitialized: true, // Save a session that is uninitialized (default: false)
        rolling: true, // Refresh cookie expiration on every request
        cookie: { 
            maxAge: 30 * 60 * 1000, // 30 minutes (in milliseconds)
            secure: false, // Set to true if using HTTPS, false for HTTP
            httpOnly: true // Prevent client-side JavaScript from accessing the cookie
        }
    })
);

app.use(express.static('./public'));

app.get('/client-main', loggedIn, async(req, res) => { 
    res.render('client-main', { email: req.session.Cemail, Fname:req.session.Fname, Lname:req.session.Lname, userType: req.cookies.userType}); // Render client main
});

app.get('/loan-provider-main', loggedIn, (req, res) => { 
    res.render('loan-provider-main', { email: req.session.Lemail, Fname:req.session.Fname, Lname:req.session.Lname,userType: req.cookies.userType}); // Render loan provider main
});

app.get('/client/getPosts' ,async (req, res) => {
    const clientEmail = req.cookies.email;
    try {
        const posts = await db.getClientPosts(clientEmail); 
        
        res.json({ success: true, posts: posts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/loanProvider/getPosts' ,async (req, res) => {
    const loanProviderEmail = req.cookies.email;
    try {
        const posts = await db.getLoanProviderPosts(loanProviderEmail); 
        
        res.json({ success: true, posts: posts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/client/getMatchedPosts' ,async (req, res) => {
    const clientEmail = req.cookies.email;
    try {
        await db.matchPosts();
        const posts = await db.getClientMatchedPosts(clientEmail);
        
        res.json({ success: true, posts: posts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/loanProvider/getMatchedPosts' ,async (req, res) => {
    const loanProviderEmail = req.cookies.email;
    try {
        await db.matchPosts();
        const posts = await db.getLoanProviderMatchedPosts(loanProviderEmail);
        
        res.json({ success: true, posts: posts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/acceptPost', async (req, res) => {
    const { M_ID, Email,userType } = req.body;

    try {
        const result = await db.acceptMatch(M_ID, Email,userType);

        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.json({ status: 'error', message: 'An error occurred while processing your request' });
    }
});

app.post('/declinePost', async (req, res) => {
    const { M_ID } = req.body;

    try {
        const result = await db.declineMatch(M_ID);

        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.json({ status: 'error', message: 'An error occurred while processing your request' });
    }
});

app.post('/client/deletePost', async (req, res) => {
    const { P_ID } = req.body;

    try {
        const result = await db.deleteClientPost(P_ID);

        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.json({ status: 'error', message: 'An error occurred while processing your request' });
    }
})

app.post('/loanProvider/deletePost', async (req, res) => {
    const { O_ID } = req.body;

    try {
        const result = await db.deleteLoanProviderPost(O_ID);

        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.json({ status: 'error', message: 'An error occurred while processing your request' });
    }
})


// Integrate the routers
app.use('/signup',signup);
app.use('/login', login);
app.use('/client', createPost);
app.use('/loan-provider', createOffer);

app.post('/logout', (req, res) => {
    
    // Destroy the session (this logs the user out)
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).end();
        }
        
        // Clear the session cookie
        res.clearCookie('connect.sid');
        
        // Respond with a success message
        return res.status(200).end();
    });
});


// Starts the Express server on port 3000.
const PORT = 3000;
server.listen(PORT, () => {
    const link = `http://localhost:${PORT}`;
    console.log(`Server is running on ${link}`);
});

