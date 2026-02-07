const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const JWT_SECRET=process.env.JWT_SECRET

module.exports = (db) => {
  const router = express.Router();

  // ================= JWT Middleware =================
  function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }

  // ================= Departments =================
  router.get("/api/departments/list", authenticateToken, (req, res) => {
    const sql = "SELECT department_id, department_name FROM departments WHERE status='ACTIVE'";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });

  // ================= Categories =================
  router.get("/api/categories/by-department/:departmentId", authenticateToken, (req, res) => {
    const sql = `
      SELECT category_id, category_name, category_code
      FROM complaint_categories
      WHERE department_id = ? AND status='ACTIVE'
    `;
    db.query(sql, [req.params.departmentId], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });

  // ================= Multer =================
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = "./uploads/category-gallery";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage });

  // ================= Upload =================
  router.post("/api/category-gallery", authenticateToken, upload.single("image"), (req, res) => {
    const { category_id, image_description } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const image_path = `uploads/category-gallery/${req.file.filename}`;

    const sql = `
      INSERT INTO category_gallery (category_id, image_path, image_description)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [category_id, image_path, image_description], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Uploaded", image_id: result.insertId });
    });
  });

  // ================= List Images =================
  router.get("/api/category-gallery/:categoryId", authenticateToken, (req, res) => {
    db.query(
      "SELECT * FROM category_gallery WHERE category_id = ? ORDER BY uploaded_at DESC",
      [req.params.categoryId],
      (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
      }
    );
  });

  // ================= Delete =================
  router.delete("/api/category-gallery/:imageId", authenticateToken, (req, res) => {
    const imageId = req.params.imageId;

    db.query("SELECT image_path FROM category_gallery WHERE image_id = ?", [imageId], (err, rows) => {
      if (err) return res.status(500).json(err);
      if (!rows.length) return res.status(404).json({ error: "Not found" });

      const imagePath = rows[0].image_path;

      db.query("DELETE FROM category_gallery WHERE image_id = ?", [imageId], (err2) => {
        if (err2) return res.status(500).json(err2);

        fs.unlink(imagePath, () => {});
        res.json({ message: "Deleted" });
      });
    });
  });

  return router;
};
