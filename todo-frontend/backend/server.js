// server.js
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "R_diva_0110_",
  database: "complaint_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Nodemailer setup (use your SMTP config)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ungaarusuvai1709@gmail.com",
    pass: "uwvg pqsj awdv zcps", 
  },
});

// Helper: generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// -------------------- CITIZEN SIGNUP -------------------- //
app.post("/get_otp", async (req, res) => {
  try {
    const form = req.body;

    // Check if email already exists
    const [exists] = await db.query(
      "SELECT * FROM CitizenSignup WHERE email = ?",
      [form.email]
    );
    if (exists.length > 0) return res.status(400).json({ message: "Email already registered" });

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Save OTP and form data
    await db.query(
      `INSERT INTO citizen_otps (email, otp, form_data, expires_at)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE otp=?, form_data=?, expires_at=?`,
      [form.email, otp, JSON.stringify(form), expiresAt, otp, JSON.stringify(form), expiresAt]
    );

    // Send OTP email
    await transporter.sendMail({
      from: '"OCMS" <your_email@gmail.com>',
      to: form.email,
      subject: "Your OTP for OCMS Registration",
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/verify_otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM citizen_otps WHERE email = ?",
      [email]
    );
    if (!rows.length) return res.status(400).json({ message: "OTP not found" });

    const otpData = rows[0];
    if (otpData.expires_at < new Date()) return res.status(400).json({ message: "OTP expired" });
    if (otpData.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const form = JSON.parse(otpData.form_data);

    // Hash password
    const hashedPassword = await bcrypt.hash(form.password, 10);

    // Insert user
    await db.query(
      `INSERT INTO CitizenSignup
      (first_name,last_name,dob,gender,mobile,email,password,security_question,security_answer,
      country,state,district,city,pincode,address_line1,address_line2,gov_id_type,gov_id_last4,alt_phone,
      language,notify_sms,notify_email,notify_whatsapp)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        form.firstName, form.lastName, form.dob, form.gender, form.mobile, form.email,
        hashedPassword, form.securityQuestion, form.securityAnswer,
        form.country, form.state, form.district, form.city, form.pincode, form.addressLine1,
        form.addressLine2, form.govIdType, form.govIdLast4, form.altPhone,
        form.language, form.notifySms ? 1 : 0, form.notifyEmail ? 1 : 0, form.notifyWhatsApp ? 1 : 0
      ]
    );

    // Delete OTP after successful registration
    await db.query("DELETE FROM citizen_otps WHERE email=?", [email]);

    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- LOGIN -------------------- //

// Password login
app.post("/login/password", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM CitizenSignup WHERE email = ?",
      [email]
    );
    if (!rows.length) return res.status(400).json({ message: "Email not registered" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Request login OTP
app.post("/login/request-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM CitizenSignup WHERE email = ?",
      [email]
    );
    if (!rows.length) return res.status(400).json({ message: "Email not registered" });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      `INSERT INTO login_otps (email, otp, purpose, expires_at)
       VALUES (?, ?, 'login', ?)
       ON DUPLICATE KEY UPDATE otp=?, expires_at=?`,
      [email, otp, expiresAt, otp, expiresAt]
    );

    await transporter.sendMail({
      from: '"OCMS" <your_email@gmail.com>',
      to: email,
      subject: "Your Login OTP",
      text: `Your login OTP is ${otp}. Expires in 10 minutes.`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify login OTP
app.post("/login/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM login_otps WHERE email = ? AND purpose='login'",
      [email]
    );
    if (!rows.length) return res.status(400).json({ message: "OTP not found" });

    const otpData = rows[0];
    if (otpData.expires_at < new Date()) return res.status(400).json({ message: "OTP expired" });
    if (otpData.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    await db.query("DELETE FROM login_otps WHERE email=? AND purpose='login'", [email]);

    res.json({ message: "Login successful via OTP" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- FORGOT PASSWORD -------------------- //

// Request forgot password OTP
app.post("/forgot/request-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM CitizenSignup WHERE email = ?",
      [email]
    );
    if (!rows.length) return res.status(400).json({ message: "Email not registered" });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      `INSERT INTO login_otps (email, otp, purpose, expires_at)
       VALUES (?, ?, 'forgot', ?)
       ON DUPLICATE KEY UPDATE otp=?, expires_at=?`,
      [email, otp, expiresAt, otp, expiresAt]
    );

    await transporter.sendMail({
      from: '"OCMS" <your_email@gmail.com>',
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. Expires in 10 minutes.`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify forgot password OTP and update password
app.post("/forgot/verify-otp", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const [rows] = await db.query(
            "SELECT * FROM login_otps WHERE email = ? AND purpose='forgot'",
            [email]
        );
        if (!rows.length) return res.status(400).json({ message: "OTP not found" });

        const otpData = rows[0];
        if (new Date(otpData.expires_at) < new Date()) {
            alert("OTP TIME EXPIRED PLEASE RE-CONNECT !!");
            return res.status(400).json({ message: "OTP expired" });
        }

    if (otpData.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE CitizenSignup SET password=? WHERE email=?", [hashedPassword, email]);
    await db.query("DELETE FROM login_otps WHERE email=? AND purpose='forgot'", [email]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- START SERVER -------------------- //
const PORT = 5000;
app.listen(PORT, () => console.log(`\n Server running on port 
    http://localhost:${PORT}`));
