const express = require("express");
const cors = require("cors");
require("dotenv").config();

const path = require('path');
const app = express();

// initialize DB connection (loads `server/src/config/db.js`)
require("./config/db");

// API routes
const categoriesRouter = require('./routes/categories');
const complaintsRouter = require('./routes/complaints');
const authRouter = require('./routes/auth');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/complaints', complaintsRouter);

// serve uploaded proof files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// 404 handler (returns JSON)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler (returns JSON)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err));
  res.status(err && err.status ? err.status : 500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
