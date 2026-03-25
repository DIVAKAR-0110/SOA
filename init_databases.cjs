const mysql = require('mysql2/promise');

const config = {
  host: "localhost",
  user: "root",
  password: "R_diva_0110_",
  database: "complaintt_system",
  multipleStatements: true
};

const sql = `
CREATE TABLE IF NOT EXISTS CitizenSignup (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  dob DATE,
  gender VARCHAR(10),
  mobile VARCHAR(15),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  country VARCHAR(50),
  state VARCHAR(50),
  district VARCHAR(50),
  city VARCHAR(50),
  pincode VARCHAR(6),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  gov_id_type VARCHAR(20),
  gov_id_last4 VARCHAR(4),
  alt_phone VARCHAR(15),
  language VARCHAR(20),
  notify_sms BOOLEAN,
  notify_email BOOLEAN,
  notify_whatsapp BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS citizen_otps (
  email VARCHAR(100) PRIMARY KEY,
  otp VARCHAR(6),
  form_data LONGTEXT NOT NULL,
  expires_at DATETIME
);

CREATE TABLE IF NOT EXISTS login_otps (
  email VARCHAR(100),
  otp VARCHAR(6),
  purpose VARCHAR(50),
  expires_at DATETIME,
  PRIMARY KEY (email, purpose)
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT,
  location_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50),
  address TEXT,
  landmark VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES CitizenSignup(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  file_type VARCHAR(50),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  INDEX idx_complaint_id (complaint_id)
);

CREATE TABLE IF NOT EXISTS staff_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  role ENUM('SECONDARY_ADMIN','HEAD','STAFF','EMPLOYEE') NOT NULL,
  department VARCHAR(100),
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  city VARCHAR(100),
  aadhaar VARCHAR(12) UNIQUE NOT NULL,
  pan VARCHAR(20),
  voter_id VARCHAR(20),
  address TEXT NOT NULL,
  qualification VARCHAR(100),
  years_of_experience VARCHAR(50),
  designation VARCHAR(100),
  status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  approved_by INT DEFAULT NULL,
  approved_at TIMESTAMP NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff_registration_otps (
  email VARCHAR(100) PRIMARY KEY,
  otp VARCHAR(6) NOT NULL,
  form_data LONGTEXT NOT NULL,
  expires_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  admin_name VARCHAR(100),
  admin_email VARCHAR(100) UNIQUE,
  admin_password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'SUPER_ADMIN',
  status VARCHAR(20) DEFAULT 'ACTIVE'
);

-- Basic Data
INSERT IGNORE INTO categories (name) VALUES ('Electricity'), ('Water'), ('Roads'), ('Sanitation'), ('Other');
INSERT IGNORE INTO locations (name) VALUES ('City A'), ('City B'), ('City C'), ('District X'), ('State Y');
`;

async function init() {
  let connection;
  try {
    connection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        multipleStatements: true
    });
    
    console.log('Connecting to MySQL...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
    await connection.changeUser({ database: config.database });
    
    console.log(`Using database: ${config.database}`);
    
    const statements = sql.split(';').filter(s => s.trim());
    for (let statement of statements) {
        await connection.query(statement);
    }
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    if (connection) await connection.end();
  }
}

init();
