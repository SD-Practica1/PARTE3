// db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "D@nilo22",
    database: "Controlasistencia1"
});

module.exports = pool;
