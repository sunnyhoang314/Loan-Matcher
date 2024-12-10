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
    } else {
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

        // Proceed with insertion only if the email doesn't exist in any table
        const insertQuery = 'INSERT INTO client (CEmail, Fname, Lname, CPhone, CLocation, DOB_Establishment, Credit, CPassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await con.promise().query(insertQuery, [email, firstName, lastName, phone, location, DOBorEST, creditScore, password]);
        console.log('Client signed up successfully');
        return { status: 'success' };
    } catch (err) {
        console.error('Error occurred during signup:', err);
        return { status: 'error', message: ' Error occurred during signup' };
    }
};

module.exports.loginClient = async function (email, password) {
    try {
        // Check if the email and password match
        const query = 'SELECT * FROM client WHERE CEmail = ? AND CPassword = ?';
        const result = await con.promise().query(query, [email, password]);
        if (result[0].length > 0) {
            console.log('Client logged in successfully');
            return { status: 'success' };
        } else {
            console.log('Invalid email or password');
            return { status: 'error', message: 'Invalid email or password' };
        }
    } catch (err) {
        console.error('Error occurred during login:', err);
        return { status: 'error', message: 'Error occurred during login' };
    }
};

module.exports.signupLoanProvider = async function (firstName, lastName, email, phone, location, license, password) {
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
        // const checkAdminEmailQuery = 'SELECT AEmail FROM admin WHERE AEmail = ?';
        // const adminResult = await con.promise().query(checkAdminEmailQuery, [email]);
        // if (adminResult[0].length > 0) {
        //     console.log('Email already exists as an admin.');
        //     return { status: 'error', message: 'Email already exists as a admin.' };
        // }

        // Proceed with insertion only if the email doesn't exist in any table
        const insertQuery = 'INSERT INTO loan_provider (LEmail, Fname, Lname, LPhone, LLocation, LicenseNo, LPassword) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await con.promise().query(insertQuery, [email, firstName, lastName, phone, location, license, password]);
        console.log('Loan Provider signed up successfully');
        return { status: 'success' };
    } catch (err) {
        console.error('Error occurred during signup:', err);
        return { status: 'error', message: ' Error occurred during signup' };
    }
};



module.exports.loginLoanProvider = async function (email, password) {
    try {
        // Check if the email and password match
        const query = 'SELECT * FROM loan_provider WHERE LEmail = ? AND LPassword = ?';
        const result = await con.promise().query(query, [email, password]);
        if (result[0].length > 0) {
            console.log('Loan Provider logged in successfully');
            return { status: 'success' };
        } else {
            console.log('Invalid email or password');
            return { status: 'error', message: 'Invalid email or password' };
        }
    } catch (err) {
        console.error('Error occurred during login:', err);
        return { status: 'error', message: 'Error occurred during login' };
    }
};

module.exports.createLoanPost = async (post) => {
    try {
        const {
            title,
            maxRate,
            minStartDate,
            minEndDate,
            maxStartDate,
            maxEndDate,
            description,
            category,
            maxAmount,
            Cemail,
        } = post;

        const query = `INSERT INTO loan_post (PTitle, Description, MaxRate, MinTermStart, MinTermEnd, MaxTermStart, MaxTermEnd, PStatus, LType, Desired_amt, CEmail)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?)`;

        const values = [title, description, maxRate, minStartDate, minEndDate, maxStartDate, maxEndDate, category, maxAmount, Cemail];

        await con.promise().query(query, values);
        return { status: "success" };
    } catch (err) {
        console.error("Database Error:", err);
        return { status: "error", message: "Failed to save loan post to database." };
    }
};

module.exports.createLoanOffer = async (post) => {
    try {
        const {
            title,
            minRate,
            minStartDate,
            minEndDate,
            maxStartDate,
            maxEndDate,
            description,
            category,
            minAmount,
            maxAmount,
            Lemail,
        } = post;

        const query = `INSERT INTO loan_offer (OName, Description, MinRate, MinTermStart, MinTermEnd, MaxTermStart, MaxTermEnd, OStatus, LType, Min_amt, Max_amt, LEmail)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?)`;

        const values = [title, description, minRate, minStartDate, minEndDate, maxStartDate, maxEndDate, category, minAmount, maxAmount, Lemail];

        await con.promise().query(query, values);
        return { status: "success" };
    } catch (err) {
        console.error("Database Error:", err);
        return { status: "error", message: "Failed to save loan offer to database." };
    }
};

module.exports.getClientMatchedPosts = async (email) => {
    const query = `
        SELECT 
            mp.M_ID AS M_ID,
            mp.MStatus AS status,
            mp.MRate AS score,
            mp.CDecision AS CDecision,
            lp.PTitle AS Ptitle,
            lo.OName AS Otitle,
            CONCAT(lo.MinTermStart, ' to ', lo.MinTermEnd) AS minTermLength,
            CONCAT(lo.MaxTermStart, ' to ', lo.MaxTermEnd) AS maxTermLength,
            lo.Description AS description,
            lo.Max_amt AS maxLoanAmount,
            lo.MinRate AS minInterestRate,
            lo.LType AS category,
            lo.LEmail AS Lemail,
            loanProvider.LPhone AS phone,
            loanProvider.Fname AS Fname,
            loanProvider.Lname AS Lname
        FROM matched_post mp
        JOIN loan_post lp ON mp.P_ID = lp.P_ID
        JOIN loan_offer lo ON mp.O_ID = lo.O_ID
        JOIN loan_provider loanProvider ON lo.LEmail = loanProvider.LEmail
        WHERE lp.CEmail = ? 
        ORDER BY mp.MRate DESC
    `;
    const [rows] = await con.promise().query(query, [email]);
    return rows;
};

module.exports.getLoanProviderMatchedPosts = async (email) => {
    const query = `
        SELECT 
            mp.M_ID AS M_ID,
            mp.MStatus AS status,
            mp.MRate AS score,
            mp.LDecision AS LDecision,
            lp.PTitle AS Ptitle,
            lo.OName AS Otitle,
            CONCAT(lp.MinTermStart, ' to ', lp.MinTermEnd) AS minTermLength,
            CONCAT(lp.MaxTermStart, ' to ', lp.MaxTermEnd) AS maxTermLength,
            lp.Description AS description,
            lp.Desired_amt AS loanAmount,
            lp.MaxRate AS maxInterestRate,
            lp.LType AS category,
            lp.CEmail AS Cemail,
            c.CPhone AS phone,
            c.Fname AS Fname,
            c.Lname AS Lname
        FROM matched_post mp
        JOIN loan_post lp ON mp.P_ID = lp.P_ID
        JOIN loan_offer lo ON mp.O_ID = lo.O_ID
        JOIN client c ON lp.CEmail = c.CEmail
        WHERE lo.LEmail = ?
        ORDER BY mp.MRate DESC 
    `;
    const [rows] = await con.promise().query(query, [email]);
    return rows;
};

module.exports.getClientPosts = async (email) => {
    const query = `
        SELECT 
            lp.P_ID AS P_ID,
            lp.PTitle AS title,
            CONCAT(lp.MinTermStart, ' to ', lp.MinTermEnd) AS minTermLength,
            CONCAT(lp.MaxTermStart, ' to ', lp.MaxTermEnd) AS maxTermLength,
            lp.Description AS description,
            lp.Desired_amt AS desiredAmount,
            lp.MaxRate AS maxInterestRate,
            lp.LType AS category
        FROM loan_post lp
        WHERE lp.CEmail = ?
    `;
    const [rows] = await con.promise().query(query, [email]);
    return rows;
};

module.exports.getLoanProviderPosts = async (email) => {
    const query = `
        SELECT 
            lo.O_ID AS O_ID,
            lo.Oname AS title,
            CONCAT(lo.MinTermStart, ' to ', lo.MinTermEnd) AS minTermLength,
            CONCAT(lo.MaxTermStart, ' to ', lo.MaxTermEnd) AS maxTermLength,
            lo.Description AS description,
            lo.Min_amt AS minLoanAmount,
            lo.Max_amt AS maxLoanAmount,
            lo.MinRate AS minInterestRate,
            lo.LType AS category
        FROM loan_offer lo
        WHERE lo.LEmail = ?
    `;
    const [rows] = await con.promise().query(query, [email]);
    return rows;
};

module.exports.matchPosts = async () => {
    try {
        const query = `
            INSERT INTO MATCHED_POST (MRate, MDate, MStatus, P_ID, O_ID, CEmail, LEmail)
            SELECT 
                (
                    (
                        CASE 
                            WHEN lp.maxTermStart > lo.maxTermStart AND lp.maxTermEnd < lo.maxTermEnd THEN 1  -- Score 1 for lp.maxTermStart > lo.maxTermStart and lp.maxTermEnd < lo.maxTermEnd
                            ELSE 0
                        END
                    ) +
                    (
                        CASE 
                            WHEN lp.minTermStart > lo.minTermStart AND lp.minTermEnd > lo.minTermEnd THEN 1  -- Score 1 for lp.minTermStart > lo.minTermStart and lp.minTermEnd > lo.minTermEnd
                            ELSE 0
                        END
                    ) +
                    (
                        CASE 
                            WHEN lp.desired_amt < lo.Max_amt THEN 1  -- Score 1 for lp.desired_amt < lo.Max_amt
                            ELSE 0
                        END
                    ) +
                    (
                        CASE 
                            WHEN lp.desired_amt > lo.Min_amt THEN 1  -- Score 1 for lp.desired_amt > lo.Min_amt
                            ELSE 0
                        END
                    ) +
                    (
                        CASE 
                            WHEN lp.MaxRate > lo.MinRate THEN 1  -- Score 1 for lp.MaxRate > lo.MinRate
                            ELSE 0
                        END
                    )
                ) AS MRate,  -- Sum of all scores (1 or 0)
                CURDATE() AS MDate,  -- Current date
                'Pending' AS MStatus,  -- Status can be 'Pending', 'Matched', etc.
                lp.P_ID,  -- Loan post ID
                lo.O_ID,  -- Loan offer ID
                lp.CEmail,  -- Client's email
                lo.LEmail  -- Loan provider's email
            FROM 
                LOAN_POST lp
            JOIN 
                LOAN_OFFER lo ON lp.LType = lo.LType
            WHERE 
                NOT EXISTS (SELECT 1 FROM MATCHED_POST mp WHERE mp.P_ID = lp.P_ID AND mp.O_ID = lo.O_ID)  -- Ensure no duplicate matches
        `;

        const [rows] = await con.promise().query(query);
        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        return { status: 'error', message: 'An error occurred while processing your request' };
    }
};


module.exports.acceptMatch = async (M_ID, Email, userType) => {
    try {
        let query, params;

        // Step 1: Update the decision based on user type
        if (userType == 'client') {
            query = `
                UPDATE MATCHED_POST
                SET CDecision = TRUE
                WHERE M_ID = ? AND CEmail = ?
            `;
            params = [M_ID, Email];
        } else if (userType == 'loanProvider') {
            query = `
                UPDATE MATCHED_POST
                SET LDecision = TRUE
                WHERE M_ID = ? AND LEmail = ?
            `;
            params = [M_ID, Email];
        } else {
            throw new Error('Invalid user type');
        }

        // Execute the decision update
        const [decisionResults] = await con.promise().query(query, params);

        if (decisionResults.affectedRows > 0) {
            // Step 2: Check if both decisions are TRUE and update MStatus
            const [statusResults] = await con.promise().query(
                `
                UPDATE MATCHED_POST
                SET MStatus = 'Accepted'
                WHERE M_ID = ? AND CDecision = TRUE AND LDecision = TRUE
                `,
                [M_ID]
            );

            // Determine the final message
            if (statusResults.affectedRows > 0) {
                return { status: 'success', message: 'Post fully accepted!' };
            } else {
                return { status: 'success', message: 'Decision updated, but waiting for the other party.' };
            }
        } else {
            return { status: 'error', message: 'Failed to accept post' };
        }
    } catch (error) {
        console.error('Database Error:', error);
        return { status: 'error', message: 'An error occurred while processing your request' };
    }
};

module.exports.declineMatch = async (M_ID) => {
    // Check the user type to determine which field to update
    const query = `
        UPDATE matched_post
        SET MStatus = 'Declined'
        WHERE 
            M_ID = ? 
    `;

    try {
        const [result] = await con.promise().query(query, [M_ID]);
        return result.affectedRows > 0 
            ? { success: true, message: 'Match successfully declined.' }
            : { success: false, message: 'No match found or invalid credentials.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while declining the match.' };
    }
};

module.exports.deleteClientPost = async (P_ID) => {
    await con.promise().query('DELETE FROM matched_post WHERE P_ID = ?', [P_ID]);
    const query = `
        DELETE FROM LOAN_POST
        WHERE P_ID = ?
    `;
    try {
        const [result] = await con.promise().query(query, [P_ID]);
        return result.affectedRows > 0 
            ? { success: true, message: 'Post successfully deleted.' }
            : { success: false, message: 'No post found or invalid credentials.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while deleting the post.' };
    }
};

module.exports.deleteLoanProviderPost = async (O_ID) => {
    await con.promise().query('DELETE FROM matched_post WHERE O_ID = ?', [O_ID]);
    const query = `
        DELETE FROM LOAN_OFFER
        WHERE O_ID = ?
    `;
    try {
        const [result] = await con.promise().query(query, [O_ID]);
        return result.affectedRows > 0 
            ? { success: true, message: 'Post successfully deleted.' }
            : { success: false, message: 'No post found or invalid credentials.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while deleting the post.' };
    }
};


// --DATEDIFF(lp.MaxTermEnd, lp.MaxTermStart) <= 50 AND  Only consider posts with max term length differences within 30 days
// --DATEDIFF(lp.MinTermEnd, lp.MinTermStart) <= 50 AND   Only consider posts with min term length differences within 30 days
// --DATEDIFF(lp.MaxTermEnd, lp.MaxTermStart) * 0.20 -  
// --DATEDIFF(lp.MinTermEnd, lp.MinTermStart) * 0.20 -