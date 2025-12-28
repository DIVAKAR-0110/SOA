const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const sendOtpEmail = require("./mailer");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- DB CONNECTION ----------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "R_diva_0110_",
  database: "complaint_db",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    process.exit(1);
  }
  console.log("MySQL connected");
});


// ---------------- GENERATE OTP ----------------
app.post("/get_otp", async (req, res) => {
  try {
    const form = req.body;

    if (!form.acceptTerms || !form.acceptPrivacy) {
      return res.status(400).json({ message: "Consent required" });
    }

    if (form.password !== form.confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    db.query(
      `REPLACE INTO citizen_otps (email, otp, form_data, expires_at) VALUES (?, ?, ?, ?)`,
      [form.email, otp, JSON.stringify(form), expiresAt],
      async (err) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ message: "OTP storage failed" });
        }

        try {
          await sendOtpEmail(form.email, otp);
          res.json({ message: "OTP sent to email successfully" });
        } catch (mailErr) {
          console.error("Mail Error:", mailErr);
          res.status(500).json({ message: "OTP email failed" });
        }
      }
    );
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ---------------- VERIFY OTP ----------------
app.post("/verify_otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }

  db.query(
    `SELECT * FROM citizen_otps WHERE email=? AND otp=? AND expires_at > NOW()`,
    [email, otp],
    async (err, rows) => {
      if (err) {
        console.error("OTP Select Error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (rows.length === 0) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      let form;
      try {
        form = JSON.parse(rows[0].form_data);
      } catch (parseErr) {
        console.error("JSON Parse Error:", parseErr);
        return res.status(500).json({ message: "Corrupted registration data" });
      }

      try {
        const hashedPassword = await bcrypt.hash(form.password, 10);

        const insertQuery = `INSERT INTO CitizenSignup (
          first_name, last_name, dob, gender, mobile, email, password,
          country, state, district, city, pincode,
          address_line1, address_line2,
          gov_id_type, gov_id_last4, alt_phone,
          language, notify_sms, notify_email, notify_whatsapp
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const values = [
          form.firstName,
          form.lastName,
          form.dob,
          form.gender,
          form.mobile,
          form.email,
          hashedPassword,
          form.country,
          form.state,
          form.district,
          form.city,
          form.pincode,
          form.addressLine1,
          form.addressLine2,
          form.govIdType,
          form.govIdLast4,
          form.altPhone,
          form.language,
          form.notifySms ? 1 : 0,
          form.notifyEmail ? 1 : 0,
          form.notifyWhatsApp ? 1 : 0,
        ];

        db.query(insertQuery, values, (insertErr) => {
          if (insertErr) {
            console.error("DB Insert Error:", insertErr);
            return res.status(500).json({ message: "User creation failed" });
          }

          db.query("DELETE FROM citizen_otps WHERE email=?", [email]);
          res.json({ message: "Registration successful" });
        });
      } catch (hashErr) {
        console.error("Hash Error:", hashErr);
        res.status(500).json({ message: "Password hashing failed" });
      }
    }
  );
});

app.post("/login/password", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT id, password FROM citizensignup WHERE email=?",
    [email],
    async (err, rows) => {
      if (err || rows.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const match = await bcrypt.compare(password, rows[0].password);
      if (!match) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      res.json({ message: "Login successful" });
    }
  );
});

app.post("/login/request-otp", (req, res) => {
  const { email } = req.body;

  db.query(
    "SELECT id FROM citizensignup WHERE email=?",
    [email],
    async (err, rows) => {
      if (rows.length === 0) {
        return res.status(400).json({ message: "Email not registered" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      db.query(
        `REPLACE INTO login_otps (email, otp, purpose, expires_at)
         VALUES (?, ?, 'login', ?)`,
        [email, otp, expiresAt],
        async (err) => {
          if (err) return res.status(500).json({ message: "OTP failed" });

          await sendOtpEmail(email, otp);
          res.json({ message: "OTP sent for login" });
        }
      );
    }
  );
});

app.post("/login/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  db.query(
    `SELECT * FROM login_otps
     WHERE email=? AND otp=? AND purpose='login' AND expires_at > NOW()`,
    [email, otp],
    (err, rows) => {
      if (err || rows.length === 0) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      db.query("DELETE FROM login_otps WHERE email=?", [email]);
      res.json({ message: "Login successful via OTP" });
    }
  );
});


app.post("/forgot/request-otp", (req, res) => {
  const { email } = req.body;

  db.query(
    "SELECT id FROM citizensignup WHERE email=?",
    [email],
    async (err, rows) => {
      if (rows.length === 0) {
        return res.status(400).json({ message: "Email not registered" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      db.query(
        `REPLACE INTO login_otps (email, otp, purpose, expires_at)
         VALUES (?, ?, 'forgot', ?)`,
        [email, otp, expiresAt],
        async () => {
          await sendOtpEmail(email, otp);
          res.json({ message: "Password reset OTP sent" });
        }
      );
    }
  );
});


app.post("/forgot/verify-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  db.query(
    `SELECT * FROM login_otps
     WHERE email=? AND otp=? AND purpose='forgot' AND expires_at > NOW()`,
    [email, otp],
    async (err, rows) => {
      if (rows.length === 0) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      db.query(
        "UPDATE citizens SET password=? WHERE email=?",
        [hashed, email],
        () => {
          db.query("DELETE FROM login_otps WHERE email=?", [email]);
          res.json({ message: "Password updated successfully" });
        }
      );
    }
  );
});


// ---------------- SERVER START ----------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
