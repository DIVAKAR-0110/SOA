const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sendOtpEmail = require("./mailer");
const router = express.Router();

// Ensure upload directory exists
const staffUploads = path.join(__dirname, "uploads", "staff");
try {
  fs.mkdirSync(staffUploads, { recursive: true });
  console.log("Ensured uploads directory:", staffUploads);
} catch (e) {
  console.error("Failed to ensure uploads directory:", e);
}

/* ========== FILE STORAGE ========== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/staff/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

module.exports = (db) => {

  /* ================= SEND OTP ================= */
  router.post("/api/send-otp", async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60000);

    const sql = `
      INSERT INTO starting_apply_email_otps (email, otp, expires_at)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [email, otp, expires], async (err) => {
      if (err) {
        console.error("DB error inserting OTP:", err);
        return res.status(500).json({ message: "DB error" });
      }

      try {
        await sendOtpEmail(email, otp);
        console.log(`OTP sent to ${email}`);
        return res.json({ message: "OTP sent" });
      } catch (mailErr) {
        // OTP is stored but email failed to send - log and inform client
        console.error("Error sending OTP email:", mailErr);
        return res.status(500).json({ message: "OTP saved but failed to send email" });
      }
    });
  });

  /* ================= VERIFY OTP ================= */
  router.post("/api/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    const sql = `
      SELECT * FROM starting_apply_email_otps
      WHERE email=? AND otp=? AND verified=FALSE AND expires_at > NOW()
      ORDER BY id DESC LIMIT 1
    `;
    db.query(sql, [email, otp], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.json({ verified: false });

      db.query(
  "UPDATE starting_apply_email_otps SET verified=TRUE WHERE id=?",
  [result[0].id]
);

      res.json({ verified: true });
    });
  });


  router.get("/api/jobapplication-departments", (req, res) => {
  db.query(
    `SELECT department_id, department_name
     FROM departments
     WHERE status = 'ACTIVE'
     ORDER BY department_name ASC`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

  router.get("/api/jobapplication-categories/:departmentId", (req, res) => {
    db.query(
      `SELECT category_id, category_name
       FROM complaint_categories
       WHERE department_id = ? AND status='ACTIVE'`,
      [req.params.departmentId],
      (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
      }
    );
  });

  router.get("/api/jobapplication-skills", (req, res) => {
  db.query(
    `SELECT skill_id, skill_name FROM skills WHERE status = 'ACTIVE'`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});



  
  /* ================= STAFF APPLY ================= */
  router.post(
  "/api/staff/apply",
  upload.fields([
    { name: "profile_photo" },
    { name: "resume_pdf" },
    { name: "degree_certificate" },
  ]),
  (req, res) => {
    const f = req.body;
    const files = req.files || {};

    try {
      // Ensure numeric fields are either int or NULL
      const numericFields = [
        "country_id",
        "state_id",
        "district_id",
        "city_id",
        "locality_id",
        "year_of_passing",
        "years_of_experience",
        "interested_department",
        "selected_category",
        "skill_id",
        "service_type_id",
      ];

      numericFields.forEach((key) => {
        if (f[key] === "" || f[key] === undefined) f[key] = null;
      });

      const sql = `
        INSERT INTO staff_applications (
          role_applied_for, full_name, last_name, email, mobile_number, aadhaar_number,
          address_line, pincode, date_of_birth,
          country_id, state_id, district_id, city_id, locality_id,
          highest_degree, field_of_study, institute_name, year_of_passing,
          years_of_experience, interested_department, selected_category,
          leadership_experience, skill_id, service_type_id,
          vehicle_available, driving_license_no, physically_fit,
          profile_photo, resume_pdf, degree_certificate
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;

      const parseNumber = (val) => {
  const n = Number(val);
  return isNaN(n) ? null : n; 
};


      const values = [
  f.role_applied_for || null,
  f.full_name || null,
  f.last_name || null,
  f.email || null,
  f.mobile_number || null,
  f.aadhaar_number || null,
  f.address_line || null,
  f.pincode || null,
  f.date_of_birth || null,
  parseNumber(f.country_id),
  parseNumber(f.state_id),
  parseNumber(f.district_id),
  parseNumber(f.city_id),
  parseNumber(f.locality_id),
  f.highest_degree || null,
  f.field_of_study || null,
  f.institute_name || null,
  parseNumber(f.year_of_passing),
  parseNumber(f.years_of_experience),      // ✅ make sure parseNumber is used here
  parseNumber(f.interested_department),
  parseNumber(f.selected_category),
  f.leadership_experience || null,
  parseNumber(f.skill_id),
  parseNumber(f.service_type_id),          // ✅ make sure parseNumber is used here
  f.vehicle_available || null,
  f.driving_license_no || null,
  f.physically_fit || null,
  files.profile_photo?.[0]?.filename || null,
  files.resume_pdf?.[0]?.filename || null,
  files.degree_certificate?.[0]?.filename || null,
];



      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("DB insert error:", err);
          return res.status(500).json({ message: "DB insert error", error: err.message });
        }
        res.json({ message: "Application submitted (PENDING)", id: result.insertId });
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ message: "Unexpected server error", error: err.message });
    }
  }
);
  return router;
};
