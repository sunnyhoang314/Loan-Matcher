var express = require('express');
var router = express.Router();
var bodyParser  = require('body-parser');
const multer = require('multer');

var db = require('../models/db_controller');
var mysql = require('mysql2');
const { check, validationResult } = require('express-validator');

// Multer setup (for parsing multipart/form-data)
const upload = multer();

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
    upload.none(),
    [
    //Validation rules
    check('email').isEmail().withMessage('Enter a valid email'),
    check('DOBorEST').isDate().withMessage('Enter a valid Date of birth or Establishment'),
    check("password")
        .isLength({ min: 8 })
        .withMessage('Password must be at least 4 characters long'),
    check('confirmPassword')
        .custom((value, { req }) => {
            // Compare password and confirmPassword
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    ],
    async function(req, res) {
        // console.log(req.body); // Log the request body
        // console.log(req.headers);
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                error: errors.array()[0].msg, // Return the first error message
            });
        }

        const { firstName, lastName, email, phone, location, DOBorEST, creditScore, password} = req.body;
        const result = await db.signupClient(firstName, lastName, email, phone, location, DOBorEST, creditScore, password);

        if (result.status === 'error') {
            return res.status(400).json({
                status: "error",
                error: result.message, 
            });
        }

        // Respond with success message
        res.json({
            status: "success",
            message: "User registered successfully!",
        });
    }
);

module.exports = router;