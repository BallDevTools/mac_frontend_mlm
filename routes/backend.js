var express = require("express");
var mysql = require('mysql2/promise');
var router = express();

async function testConnection() {
    // กำหนดค่าการเชื่อมต่อ
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'MML'
    });
  
    try {
      await connection.connect();
      console.log('Successfully connected to MySQL database!');
      const [rows, fields] = await connection.execute('SELECT 1 + 1 AS result');
      console.log('Query result:', rows[0].result);
    } catch (error) {
      console.error('Error connecting to the database:', error);
    } finally {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
//   testConnection();

// path dashboard
// router.get('/login', function(req, res, next) {
//     res.render('backend/login');
// })
// router.get('/register', function(req, res, next) {
//     res.render('backend/register');
// })

// router.get('/dashboard', function(req, res, next) {
//     res.render('dashboard');
// })



// api backend

// router.post('/login', function(req, res, next) {
//     var {username, password} = req.body;
//     console.log(req.body)
// })

// router.post('/register', function(req, res, next) {

// })
module.exports = router;
