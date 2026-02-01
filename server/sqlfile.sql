DROP DATABASE IF EXISTS complaint_db;
CREATE DATABASE complaint_db;
USE complaint_db;

CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO locations (name) VALUES
('City A'),
('City B'),
('Zone 1');

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE locations;
SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO categories (name) VALUES
('Electricity'),
('Water'),
('Sanitation'),
('Road Damage'),
('Street Light'),
('Public Safety'),
('Drainage'),
('Others');

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE categories;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    role ENUM('USER','HEAD','STAFF','ADMIN') NOT NULL,
    location_id INT NULL,
    category_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ADMIN
INSERT INTO users (name, email, role)
VALUES ('System Admin', 'admin@complaint.com', 'ADMIN');

-- HEADS (location-based)
INSERT INTO users (name, email, role, location_id)
VALUES 
('Area Head A', 'heada@complaint.com', 'HEAD', 1),
('Akshuraj', 'akshuraj2k6@gmail.com', 'HEAD', 1);

UPDATE users
SET location_id = 2
WHERE id = 2;

-- STAFF (category-based)
INSERT INTO users (name, email, role, category_id)
VALUES
('Water Engineer', '71762331005@cit.edu.in', 'STAFF', 2),
('Electricity Engineer', 'electric.staff@complaint.com', 'STAFF', 1);


DROP TABLE IF EXISTS complaints;

CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Who registered (optional for now)
    user_id INT NULL,

    -- Complaint info
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,

    -- Location info
    location_id INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    landmark VARCHAR(150),

    -- Extra details
    priority ENUM('NORMAL','HIGH','EMERGENCY') DEFAULT 'NORMAL',

    -- Workflow
    status ENUM(
        'REGISTERED',
        'ASSIGNED_TO_HEAD',
        'ASSIGNED_TO_STAFF',
        'IN_PROGRESS',
        'RESOLVED'
    ) DEFAULT 'REGISTERED',

    head_id INT NULL,
    staff_id INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (head_id) REFERENCES users(id),
    FOREIGN KEY (staff_id) REFERENCES users(id)
);

show tables;

select * from complaints;
select * from users;
select * from categories;
select * from locations;
