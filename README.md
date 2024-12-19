## Loan Matcher Project Setup Guide

1. Make sure Node.js and MySQL and MySQL Workbench or XAMPP is installed

2. Install Dependencies
Install project dependencies with: `npm install`

3. Setup Environment Variables
Create a .env file with:
```
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
```

4. Import the Database and Start the Development Server
create all the tables for the database using the sql statements in database.sql then
Start the server with nodemon for auto-restarts: `npm run dev`

5. How to Add More Routes

(1) In app.js, import your route controllers and link them to paths:
```
const signup = require('./controllers/signup');
app.use('/signup', signup);

```
(2)In /controllers create a new file for a new route and  define the route logic. example code in: ./controllers/signup

7. Basic Project Structure

Place your static files (HTML, CSS, JS, images) in the public folder.
Place your dynamic files (EJS) in the view folder

```
/controllers
  └── signup.js
/models
  └── db_controller.js
/public
  └── frontend.html 
/view
  └── frontend.ejs 
.env
app.js
package.json
README.md
```

8. Troubleshooting
Run npm install if dependencies are missing.
Check MySQL server status if connection fails.

9. Import MySQL tables
In your MySQL workbench, import the CLIENT, LOAN_OFFER, LOAN_POST, LOAN_PROVIDER, amd MATCHED_POST tables.


## Code References:
Code related to setting up using Node.js and Express was referenced from the following YouTube tutorial:
https://www.youtube.com/watch?v=I6mDdLldhFw&list=PL8CsGVwzS6rMec0tyOo3RaOr0cw2Fi7oW&index=4
