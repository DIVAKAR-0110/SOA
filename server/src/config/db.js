const mysql = require("mysql2");

// Use environment variables defined in server/.env (loaded by app.js)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "my_root_aksh_04",
  database: process.env.DB_NAME || "complaint_db",
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err.message || err);
    // Do not crash automatically here; handle as appropriate for your app
  } else {
    console.log("MySQL connected");
  }
});

module.exports = db;
