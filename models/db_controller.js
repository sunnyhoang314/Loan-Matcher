require('dotenv').config();
var mysql = require('mysql2');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// Configuration for SQL Server connection
var con = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,         
    password: process.env.DB_PASSWORD,     
    database: 'loan_matcher',     
});

// Connect to the database
con.connect(function (err) {
    if (err) {
        throw err;
    }else{
        console.log('Connected to the database');
    }
});

module.exports.signup = function (email, password, fname, lname) {
    // Check if the email already exists in the USERS table
    const checkEmailQuery = 'SELECT CEmail FROM client WHERE CEmail = ?';

    con.query(checkEmailQuery, [email], function (err, result) {
        if (err) {
            console.error('Error checking email:', err);
            return;
        }

        // If no results, insert a new user
        if (result.length === 0) {
            const insertQuery = 'INSERT INTO client (CEmail, CPassword, Fname, Lname) VALUES (?, ?,?,?)';

            con.query(insertQuery, [email, password,fname,lname], function (err, insertResult) {
                if (err) {
                    console.error('Error inserting user:', err);
                } else {
                    console.log('Client signed up successfully');
                }
            });
        } else {
            console.log('Email already exists.');
        }
    });
};


