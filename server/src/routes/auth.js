const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// POST /api/auth/signup - Register new user
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // Check if user already exists
    db.query('SELECT id FROM users WHERE email = ?', [email], async (err, rows) => {
      if (err) {
        console.error('Database error checking user:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (Array.isArray(rows) && rows.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const userRole = role || 'USER';
      const insertSql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';

      db.query(insertSql, [name, email, hashedPassword, userRole], (insertErr, result) => {
        if (insertErr) {
          console.error('Failed to insert user:', insertErr);
          return res.status(500).json({ error: 'Failed to register user' });
        }

        const userId = result.insertId;

        // Create JWT token
        const token = jwt.sign({ id: userId, email, name, role: userRole }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
          success: true,
          message: 'Signup successful',
          token,
          user: { id: userId, name, email, role: userRole },
        });
      });
    });
  } catch (e) {
    console.error('Signup error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login - Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    db.query('SELECT id, name, email, password, role FROM users WHERE email = ?', [email], async (err, rows) => {
      if (err) {
        console.error('Database error finding user:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = rows[0];

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Create JWT token
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// GET /api/auth/me - Get current user info (requires token)
router.get('/me', verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
module.exports.verifyToken = verifyToken;
