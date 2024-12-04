mysql = require('mysql2');

var con = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,         
    password: process.env.DB_PASSWORD,     
    database: 'loan_matcher',     
});

const loggedIn = async (req, res, next) => {
    //console.log("Session data:", req.session); // Log the session data
    if (!req.session.loggedIn) {
        return res.redirect('/');
    }
    try {
        if (req.session.Cemail) {
            const email = req.session.Cemail;
            const query = `SELECT * FROM client WHERE Cemail = ?`;
            const [rows] = await con.promise().query(query,[email]);
            if (rows.length > 0) {
                req.session.Fname = rows[0].Fname;
                req.session.Lname = rows[0].Lname;
            }
        } else if (req.session.Lemail) {
            const email = req.session.Lemail;
            const query = `SELECT * FROM loan_provider WHERE Lemail = ?`;
            const [rows] = await con.promise().query(query,[email]);
            if (rows[0].length > 0) {
                req.session.Fname = rows[0].Fname;
                req.session.Lname = rows[0].Lname;
            }
        }
        next(); // Call the next middleware only after the queries complete
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = loggedIn;
