// db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "0000",
    database: "ControlAsistencia3"
});

module.exports = pool;
