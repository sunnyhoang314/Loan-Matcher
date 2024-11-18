var express = require('express');
var router = express.Router();
var bodyParser  = require('body-parser');
var db = require('../models/db_controller');
var mysql = require('mysql2');
const { check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/* 
EXAMPLE:router.post('/', [...], function(req, res) { ... })
    router: A router instance from Express, used to define routes in a modular way.
    .post: Specifies that this route will handle POST requests.
    '/': The path of the route. The client sends a POST request to /signup to trigger this code.
    [ ... ]: An array of middleware functions used to validate incoming data.
    function(req, res) { ... }: A callback function that runs after validation, to handle the request. 
*/
router.post(
    '/client', 
    [
    // Validation rules
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters long'),
    ],function(req, res) {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // If no errors, proceed with user registration
        res.send('User registered successfully!');
        db.signup(req.body.email, req.body.password, req.body.fname, req.body.lname);
    }
);

module.exports = router;