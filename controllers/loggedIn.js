const mysql = require('mysql2/promise');

// Create a connection pool (better than a single connection)
const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'loan_matcher',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const loggedIn = async (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.redirect('/');
    }

    try {
        let email, query, tableName;

        if (req.session.Cemail) {
            email = req.session.Cemail;
            tableName = 'client';
        } else if (req.session.Lemail) {
            email = req.session.Lemail;
            tableName = 'loan_provider';
        } else {
            return res.redirect('/'); // Redirect if no email is in session
        }

        // Fetch the user from the appropriate table
        query = `SELECT Fname, Lname FROM ${tableName} WHERE ${tableName === 'client' ? 'Cemail' : 'Lemail'} = ?`;
        const [rows] = await pool.query(query, [email]);

        if (rows.length > 0) {
            const { Fname, Lname } = rows[0];
            req.session.Fname = Fname;
            req.session.Lname = Lname;
        } else {
            console.warn(`No user found with email: ${email}`);
            return res.redirect('/'); // Redirect if no user is found
        }

        next(); // Proceed to the next middleware
    } catch (err) {
        console.error('Error in loggedIn middleware:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = loggedIn;
