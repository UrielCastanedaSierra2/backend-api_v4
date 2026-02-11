const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
});

connection.connect(err => {
  if (err) {
    console.error('Error conexión MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL Railway');
});

module.exports = connection;
