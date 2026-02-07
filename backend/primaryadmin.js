// primaryadmin.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

// ================= AUTH MIDDLEWARE =================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// ================= EXPORT FUNCTION =================
module.exports = (db) => {

  // ================= ADMIN LOGIN =================
  router.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN ATTEMPT:", email);

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const sql =
    "SELECT * FROM admins WHERE admin_email = ? AND status = 'ACTIVE'";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = result[0];

    try {
      const match = await bcrypt.compare(password, admin.admin_password);

      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          admin_id: admin.admin_id,
          role: admin.role,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("LOGIN SUCCESS:", admin.admin_email);

      return res.status(200).json({
        token,
        admin_id: admin.admin_id,
        admin_name: admin.admin_name,
      });

    } catch (error) {
      console.error("BCRYPT ERROR:", error);
      return res.status(500).json({ message: "Authentication failed" });
    }
  });
});

  // ================= ADMIN PROFILE =================
  router.get("/api/admin/me", authenticateToken, (req, res) => {
    const adminId = req.user.admin_id;
    const sql = "SELECT admin_id, admin_name, admin_email, role FROM admins WHERE admin_id = ?";
    db.query(sql, [adminId], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0) return res.status(404).json({ message: "Admin not found" });
      res.json(result[0]);
    });
  });

  // ================= ADD DEPARTMENT =================
  router.post("/api/departments", authenticateToken, (req, res) => {
    const { department_name, department_description } = req.body;
    if (!department_name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const sql = "INSERT INTO departments (department_name, department_description) VALUES (?, ?)";
    db.query(sql, [department_name, department_description], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Department added successfully", id: result.insertId });
    });
  });

  // ================= GET DEPARTMENTS WITH PAGINATION =================
  router.get("/api/departments", authenticateToken, (req, res) => {
    let { page = 1, limit = 10, sortBy = "department_name", order = "asc", search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const validSortColumns = ["department_name", "department_description", "status", "created_at"];
    if (!validSortColumns.includes(sortBy)) sortBy = "department_name";
    order = order.toLowerCase() === "desc" ? "DESC" : "ASC";

    const searchQuery = `%${search}%`;

    const countSql = `
      SELECT COUNT(*) as total 
      FROM departments
      WHERE department_name LIKE ? OR department_description LIKE ?
    `;

    const dataSql = `
      SELECT * FROM departments
      WHERE department_name LIKE ? OR department_description LIKE ?
      ORDER BY ${sortBy} ${order}
      LIMIT ? OFFSET ?
    `;

    db.query(countSql, [searchQuery, searchQuery], (err, countResult) => {
      if (err) return res.status(500).json({ message: err.message });

      const total = countResult[0]?.total || 0;
      const totalPages = Math.ceil(total / limit) || 1;

      db.query(dataSql, [searchQuery, searchQuery, limit, offset], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });

        res.json({
          data: results || [],
          pagination: {
            total,
            page,
            limit,
            totalPages,
          },
        });
      });
    });
  });

  // ================= GET SINGLE DEPARTMENT =================
  router.get("/api/departments/:id", authenticateToken, (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM departments WHERE department_id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0) return res.status(404).json({ message: "Department not found" });
      res.json(result[0]);
    });
  });

  // ================= UPDATE DEPARTMENT =================
  router.put("/api/departments/:id", authenticateToken, (req, res) => {
    const { department_name, department_description } = req.body;
    const id = req.params.id;

    const sql = `
      UPDATE departments
      SET department_name = ?, department_description = ?
      WHERE department_id = ?
    `;
    db.query(sql, [department_name, department_description, id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Department not found" });
      res.json({ message: "Department updated successfully" });
    });
  });

  // ================= UPDATE DEPARTMENT STATUS =================
  router.put("/api/departments/:id/status", authenticateToken, (req, res) => {
    const { status } = req.body;
    const id = req.params.id;

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({ message: "Status must be ACTIVE or INACTIVE" });
    }

    const sql = "UPDATE departments SET status = ? WHERE department_id = ?";
    db.query(sql, [status, id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Department not found" });
      res.json({ message: "Department status updated successfully" });
    });
  });

  // ================= DELETE DEPARTMENT =================
  router.delete("/api/departments/:id", authenticateToken, (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM departments WHERE department_id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Department not found" });
      res.json({ message: "Department deleted successfully" });
    });
  });

    
    router.post("/api/service-types", authenticateToken, (req, res) => {
  const { service_type_name, service_type_description } = req.body;

  if (!service_type_name) {
    return res.status(400).json({ message: "Service type name is required" });
  }

  const sql = `
    INSERT INTO service_types (service_type_name, service_type_description)
    VALUES (?, ?)
  `;

  db.query(
    sql,
    [service_type_name, service_type_description],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(409)
            .json({ message: "Service type already exists" });
        }
        return res.status(500).json({ message: err.message });
      }

      res.json({
        message: "Service type added successfully",
        id: result.insertId,
      });
    }
  );
});

/**
 * ============================
 * GET SERVICE TYPES (LIST)
 * GET /api/service-types
 * ============================
 */
router.get("/api/service-types", authenticateToken, (req, res) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "service_type_name",
    order = "asc",
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const validSortColumns = [
    "service_type_name",
    "service_type_description",
    "status",
    "created_at",
  ];

  if (!validSortColumns.includes(sortBy)) {
    sortBy = "service_type_name";
  }

  order = order.toLowerCase() === "desc" ? "DESC" : "ASC";
  const searchQuery = `%${search}%`;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM service_types
    WHERE service_type_name LIKE ?
       OR service_type_description LIKE ?
  `;

  const dataSql = `
    SELECT *
    FROM service_types
    WHERE service_type_name LIKE ?
       OR service_type_description LIKE ?
    ORDER BY ${sortBy} ${order}
    LIMIT ? OFFSET ?
  `;

  db.query(
    countSql,
    [searchQuery, searchQuery],
    (err, countResult) => {
      if (err) return res.status(500).json({ message: err.message });

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit) || 1;

      db.query(
        dataSql,
        [searchQuery, searchQuery, limit, offset],
        (err, results) => {
          if (err) return res.status(500).json({ message: err.message });

          res.json({
            data: results,
            pagination: {
              total,
              page,
              limit,
              totalPages,
            },
          });
        }
      );
    }
  );
});

/**
 * ============================
 * UPDATE SERVICE TYPE
 * PUT /api/service-types/:id
 * ============================
 */
router.put("/api/service-types/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { service_type_name, service_type_description } = req.body;

  if (!service_type_name) {
    return res.status(400).json({ message: "Service type name is required" });
  }

  const sql = `
    UPDATE service_types
    SET service_type_name = ?, service_type_description = ?
    WHERE service_type_id = ?
  `;

  db.query(
    sql,
    [service_type_name, service_type_description, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Service type not found" });
      }

      res.json({ message: "Service type updated successfully" });
    }
  );
});

/**
 * ============================
 * UPDATE SERVICE TYPE STATUS
 * PUT /api/service-types/:id/status
 * ============================
 */
router.put(
  "/api/service-types/:id/status",
  authenticateToken,
  (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be ACTIVE or INACTIVE" });
    }

    const sql = `
      UPDATE service_types
      SET status = ?
      WHERE service_type_id = ?
    `;

    db.query(sql, [status, id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Service type not found" });
      }

      res.json({ message: "Service type status updated successfully" });
    });
  }
  );
  
    // ================= ADD SKILL =================
  router.post("/api/skills", authenticateToken, (req, res) => {
    const { skill_name, skill_description } = req.body;

    if (!skill_name) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    const sql = `
      INSERT INTO skills (skill_name, skill_description)
      VALUES (?, ?)
    `;

    db.query(sql, [skill_name, skill_description], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Skill added successfully", id: result.insertId });
    });
  });

  // ================= GET SKILLS (PAGINATION + SEARCH + SORT) =================
  router.get("/api/skills", authenticateToken, (req, res) => {
    let { page = 1, limit = 10, sortBy = "skill_name", order = "asc", search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const validSortColumns = ["skill_name", "skill_description", "status", "created_at"];
    if (!validSortColumns.includes(sortBy)) sortBy = "skill_name";
    order = order.toLowerCase() === "desc" ? "DESC" : "ASC";

    const searchQuery = `%${search}%`;

    const countSql = `
      SELECT COUNT(*) as total
      FROM skills
      WHERE skill_name LIKE ? OR skill_description LIKE ?
    `;

    const dataSql = `
      SELECT * FROM skills
      WHERE skill_name LIKE ? OR skill_description LIKE ?
      ORDER BY ${sortBy} ${order}
      LIMIT ? OFFSET ?
    `;

    db.query(countSql, [searchQuery, searchQuery], (err, countResult) => {
      if (err) return res.status(500).json({ message: err.message });

      const total = countResult[0]?.total || 0;
      const totalPages = Math.ceil(total / limit) || 1;

      db.query(dataSql, [searchQuery, searchQuery, limit, offset], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });

        res.json({
          data: results || [],
          pagination: {
            total,
            page,
            limit,
            totalPages,
          },
        });
      });
    });
  });

  // ================= GET SINGLE SKILL =================
  router.get("/api/skills/:id", authenticateToken, (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM skills WHERE skill_id = ?";

    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0) return res.status(404).json({ message: "Skill not found" });
      res.json(result[0]);
    });
  });

  // ================= UPDATE SKILL =================
  router.put("/api/skills/:id", authenticateToken, (req, res) => {
    const { skill_name, skill_description } = req.body;
    const id = req.params.id;

    const sql = `
      UPDATE skills
      SET skill_name = ?, skill_description = ?
      WHERE skill_id = ?
    `;

    db.query(sql, [skill_name, skill_description, id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Skill not found" });
      res.json({ message: "Skill updated successfully" });
    });
  });

  // ================= UPDATE SKILL STATUS =================
  router.put("/api/skills/:id/status", authenticateToken, (req, res) => {
    const { status } = req.body;
    const id = req.params.id;

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({ message: "Status must be ACTIVE or INACTIVE" });
    }

    const sql = "UPDATE skills SET status = ? WHERE skill_id = ?";

    db.query(sql, [status, id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Skill not found" });
      res.json({ message: "Skill status updated successfully" });
    });
  });

    // ================= ADD PRIORITY =================
  router.post("/api/priorities", authenticateToken, (req, res) => {
    const { priority_name, priority_description } = req.body;

    if (!priority_name) {
      return res.status(400).json({ message: "Priority name is required" });
    }

    const sql = `
      INSERT INTO priorities (priority_name, priority_description)
      VALUES (?, ?)
    `;

    db.query(sql, [priority_name, priority_description], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Priority added successfully", id: result.insertId });
    });
  });

  // ================= GET PRIORITIES =================
  router.get("/api/priorities", authenticateToken, (req, res) => {
    let { page = 1, limit = 10, sortBy = "priority_name", order = "asc", search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const validSortColumns = ["priority_name", "priority_description", "status", "created_at"];
    if (!validSortColumns.includes(sortBy)) sortBy = "priority_name";
    order = order.toLowerCase() === "desc" ? "DESC" : "ASC";

    const searchQuery = `%${search}%`;

    const countSql = `
      SELECT COUNT(*) as total
      FROM priorities
      WHERE priority_name LIKE ? OR priority_description LIKE ?
    `;

    const dataSql = `
      SELECT * FROM priorities
      WHERE priority_name LIKE ? OR priority_description LIKE ?
      ORDER BY ${sortBy} ${order}
      LIMIT ? OFFSET ?
    `;

    db.query(countSql, [searchQuery, searchQuery], (err, countResult) => {
      if (err) return res.status(500).json({ message: err.message });

      const total = countResult[0]?.total || 0;
      const totalPages = Math.ceil(total / limit) || 1;

      db.query(dataSql, [searchQuery, searchQuery, limit, offset], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });

        res.json({
          data: results || [],
          pagination: {
            total,
            page,
            limit,
            totalPages,
          },
        });
      });
    });
  });

  // ================= GET SINGLE PRIORITY =================
  router.get("/api/priorities/:id", authenticateToken, (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM priorities WHERE priority_id = ?";

    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0) return res.status(404).json({ message: "Priority not found" });
      res.json(result[0]);
    });
  });

  // ================= UPDATE PRIORITY =================
  router.put("/api/priorities/:id", authenticateToken, (req, res) => {
    const { priority_name, priority_description } = req.body;
    const id = req.params.id;

    const sql = `
      UPDATE priorities
      SET priority_name = ?, priority_description = ?
      WHERE priority_id = ?
    `;

    db.query(sql, [priority_name, priority_description, id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Priority not found" });

      res.json({ message: "Priority updated successfully" });
    });
  });

  // ================= UPDATE PRIORITY STATUS =================
  router.put("/api/priorities/:id/status", authenticateToken, (req, res) => {
    const { status } = req.body;
    const id = req.params.id;

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({ message: "Status must be ACTIVE or INACTIVE" });
    }

    const sql = "UPDATE priorities SET status = ? WHERE priority_id = ?";

    db.query(sql, [status, id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Priority not found" });

      res.json({ message: "Priority status updated successfully" });
    });
  });





// ================= ADD CATEGORY =================
router.post("/api/complaint-categories", authenticateToken, (req, res) => {
  const {
    category_code,
    category_name,
    category_description,
    department_id,
    service_type_id,
    skill_id,
    priority_id,
    expected_resolution_days = 7,
    is_public = true
  } = req.body;

  if (!category_code || !category_name || !department_id || !service_type_id || !skill_id || !priority_id) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const sql = `
    INSERT INTO complaint_categories
    (category_code, category_name, category_description,
     department_id, service_type_id, skill_id, priority_id,
     expected_resolution_days, is_public)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      category_code,
      category_name,
      category_description,
      department_id,
      service_type_id,
      skill_id,
      priority_id,
      expected_resolution_days,
      is_public
    ],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Category added", id: result.insertId });
    }
  );
});

// ================= GET CATEGORIES =================
router.get("/api/complaint-categories", authenticateToken, (req, res) => {
  let { page = 1, limit = 10, sortBy = "category_name", order = "asc", search = "" } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const validSortColumns = ["category_name", "category_code", "created_at", "status"];
  if (!validSortColumns.includes(sortBy)) sortBy = "category_name";
  order = order.toLowerCase() === "desc" ? "DESC" : "ASC";

  const searchQuery = `%${search}%`;

  const countSql = `
    SELECT COUNT(*) as total
    FROM complaint_categories c
    JOIN departments d ON c.department_id = d.department_id
    JOIN service_types s ON c.service_type_id = s.service_type_id
    JOIN skills sk ON c.skill_id = sk.skill_id
    JOIN priorities p ON c.priority_id = p.priority_id
    WHERE c.category_name LIKE ? OR c.category_code LIKE ?
  `;

  const dataSql = `
    SELECT c.*, 
      d.department_name,
      s.service_type_name,
      sk.skill_name,
      p.priority_name
    FROM complaint_categories c
    JOIN departments d ON c.department_id = d.department_id
    JOIN service_types s ON c.service_type_id = s.service_type_id
    JOIN skills sk ON c.skill_id = sk.skill_id
    JOIN priorities p ON c.priority_id = p.priority_id
    WHERE c.category_name LIKE ? OR c.category_code LIKE ?
    ORDER BY ${sortBy} ${order}
    LIMIT ? OFFSET ?
  `;

  db.query(countSql, [searchQuery, searchQuery], (err, countResult) => {
    if (err) return res.status(500).json({ message: err.message });

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    db.query(dataSql, [searchQuery, searchQuery, limit, offset], (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      res.json({
        data: results || [],
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      });
    });
  });
});

// ================= GET SINGLE CATEGORY =================
router.get("/api/complaint-categories/:id", authenticateToken, (req, res) => {
  const sql = `
    SELECT c.*, 
      d.department_name,
      s.service_type_name,
      sk.skill_name,
      p.priority_name
    FROM complaint_categories c
    JOIN departments d ON c.department_id = d.department_id
    JOIN service_types s ON c.service_type_id = s.service_type_id
    JOIN skills sk ON c.skill_id = sk.skill_id
    JOIN priorities p ON c.priority_id = p.priority_id
    WHERE c.category_id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Category not found" });
    res.json(result[0]);
  });
});

// ================= UPDATE CATEGORY =================
router.put("/api/complaint-categories/:id", authenticateToken, (req, res) => {
  const {
    category_code,
    category_name,
    category_description,
    department_id,
    service_type_id,
    skill_id,
    priority_id,
    expected_resolution_days,
    is_public
  } = req.body;

  const sql = `
    UPDATE complaint_categories
    SET category_code=?, category_name=?, category_description=?,
        department_id=?, service_type_id=?, skill_id=?, priority_id=?,
        expected_resolution_days=?, is_public=?
    WHERE category_id=?
  `;

  db.query(
    sql,
    [
      category_code,
      category_name,
      category_description,
      department_id,
      service_type_id,
      skill_id,
      priority_id,
      expected_resolution_days,
      is_public,
      req.params.id
    ],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });
      res.json({ message: "Category updated" });
    }
  );
});

// ================= UPDATE CATEGORY STATUS =================
router.put("/api/complaint-categories/:id/status", authenticateToken, (req, res) => {
  const { status } = req.body;
  if (!["ACTIVE","INACTIVE"].includes(status)) return res.status(400).json({ message: "Status must be ACTIVE or INACTIVE" });

  const sql = "UPDATE complaint_categories SET status=? WHERE category_id=?";
  db.query(sql, [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Status updated" });
  });
});

  


  

  
  
  /* ================= IMAGE STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/gallery/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

  
  /* ================= GET CATEGORIES BY DEPARTMENT ================= */
router.get("/api/gallery/categories/:departmentId", authenticateToken, (req, res) => {
  const sql = "SELECT category_id, category_name FROM complaint_categories WHERE department_id=?";
  db.query(sql, [req.params.departmentId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ================= UPLOAD IMAGE ================= */
router.post(
  "/api/gallery/upload",
  authenticateToken,
  upload.single("image"),
  (req, res) => {
    const { department_id, category_id, image_description, is_common } = req.body;
    const catId = is_common === "true" ? null : category_id;

    const sql = `
      INSERT INTO complaint_gallery 
      (department_id, category_id, image_path, image_description)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [department_id, catId, req.file.filename, image_description], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Image uploaded successfully" });
    });
  }
);

/* ================= GET COMMON IMAGES ================= */
router.get("/api/gallery/common/:departmentId", authenticateToken, (req, res) => {
  const sql = `
    SELECT * FROM complaint_gallery
    WHERE department_id=? AND category_id IS NULL
    ORDER BY uploaded_at DESC
  `;
  db.query(sql, [req.params.departmentId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ================= GET CATEGORY IMAGES ================= */
router.get("/api/gallery/category/:categoryId", authenticateToken, (req, res) => {
  const sql = `
    SELECT * FROM complaint_gallery
    WHERE category_id=?
    ORDER BY uploaded_at DESC
  `;
  db.query(sql, [req.params.categoryId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ================= DELETE IMAGE ================= */
router.delete("/api/gallery/:id", authenticateToken, (req, res) => {
  const sql = "DELETE FROM complaint_gallery WHERE image_id=?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Image deleted" });
  });
});


  router.get("/api/secondary-admin/pending-count", (req, res) => {

  const sql = `
    SELECT COUNT(*) AS count
    FROM staff_applications
    WHERE role_applied_for = 'Secondary Admin'
    AND application_status = 'PENDING'
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ count: result[0].count });
  });
});



  return router;
};