-- ==========================
-- SAMUDATA DATABASE SCHEMA
-- ==========================

-- Table: categories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(150) DEFAULT NULL
);

-- Table: regions
CREATE TABLE IF NOT EXISTS regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Table: settings (untuk konfigurasi aplikasi)
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL
);

-- Table: files
CREATE TABLE IF NOT EXISTS files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(150) NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    category_id INT,
    region_id INT,
    uploader_name VARCHAR(150) NOT NULL,
    uploader_email VARCHAR(150),
    upload_date DATE DEFAULT CURRENT_DATE,
    tags JSON,
    metadata JSON,
    status ENUM('active','deleted') DEFAULT 'active',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE SET NULL
);

-- Table: file_access_logs
CREATE TABLE IF NOT EXISTS file_access_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_id INT,
    action ENUM('upload','download','view','update','delete') NOT NULL,
    ip_address VARCHAR(100),
    user_agent TEXT,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

-- Table: file_requests
CREATE TABLE IF NOT EXISTS file_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    priority ENUM('low','medium','high') DEFAULT 'medium',
    deadline DATE,
    requester_name VARCHAR(150),
    status ENUM('pending','approved','completed','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================
-- Default Data
-- ==========================

-- Default categories
INSERT IGNORE INTO categories (name, display_name) VALUES 
('kesekretariatan', 'Kesekretariatan'),
('umum', 'Umum');

-- Default region
INSERT IGNORE INTO regions (name) VALUES ('Default Region');

-- Default settings
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES
('allowed_extensions', '["pdf","docx","xlsx","pptx","jpg","png","zip"]'),
('max_file_size', '52428800'); -- 50MB
