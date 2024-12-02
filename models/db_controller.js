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

module.exports.signupClient = async function (firstName, lastName, email, phone, location, DOBorEST, creditScore, password) {
    try {

        // Check if the email already exists in the client table
        const checkEmailQuery = 'SELECT CEmail FROM client WHERE CEmail = ?';
        const clientResult = await con.promise().query(checkEmailQuery, [email]);
        if (clientResult[0].length > 0) {
            console.log('Email already exists as a client.');
            return { status: 'error', message: 'Email already exists as a client.' };
        }

        // Check if the email already exists in the loan_provider table
        const checkProviderEmailQuery = 'SELECT LEmail FROM loan_provider WHERE LEmail = ?';
        const providerResult = await con.promise().query(checkProviderEmailQuery, [email]);
        if (providerResult[0].length > 0) {
            console.log('Email already exists as a loan provider.');
            return { status: 'error', message: 'Email already exists as a loan provider.' };
        }

        // Check if the email already exists in the admin table
        const checkAdminEmailQuery = 'SELECT AEmail FROM admin WHERE AEmail = ?';
        const adminResult = await con.promise().query(checkAdminEmailQuery, [email]);
        if (adminResult[0].length > 0) {
            console.log('Email already exists as an admin.');
            return { status: 'error', message: 'Email already exists as a admin.' };
        }

        // Proceed with insertion only if the email doesn't exist in any table
        const insertQuery = 'INSERT INTO client (CEmail, Fname, Lname, CPhone, CLocation, DOB_Establishment, Credit, CPassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await con.promise().query(insertQuery, [email, firstName, lastName, phone, location, DOBorEST, creditScore, password]);
        console.log('Client signed up successfully');
        return { status: 'success'};
    } catch (err) {
        console.error('Error occurred during signup:', err);
        return { status: 'error', message: ' Error occurred during signup'};
    }
};



module.exports.loginClient = async function (email, password) {
    try {
        // Check if the email and password match
        const query = 'SELECT * FROM client WHERE CEmail = ? AND CPassword = ?';
        const result = await con.promise().query(query, [email, password]);
        if (result[0].length > 0) {
            console.log('Client logged in successfully');
            return { status: 'success'};
        } else {
            console.log('Invalid email or password');
            return { status: 'error', message: 'Invalid email or password'};
        }
    } catch (err) {
        console.error('Error occurred during login:', err);
        return { status: 'error', message: 'Error occurred during login'};
    }
};