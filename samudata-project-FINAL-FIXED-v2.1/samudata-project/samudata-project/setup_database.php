<?php
/**
 * Database Setup Script for Samudata Application
 * Run this script to initialize the database and tables
 */

require_once 'database_config.php';

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Function to create database if not exists
function createDatabase() {
    try {
        // Connect without database name first
        $dsn = "mysql:host=localhost;charset=utf8mb4";
        $pdo = new PDO($dsn, 'root', '', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        
        // Create database
        $pdo->exec("CREATE DATABASE IF NOT EXISTS samudata_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        return true;
    } catch (PDOException $e) {
        return false;
    }
}

// Function to create upload directory
function createUploadDirectory() {
    $uploadDir = __DIR__ . '/uploads';
    
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            return false;
        }
    }
    
    // Create .htaccess for security
    $htaccessContent = "# Prevent direct access to uploaded files\n";
    $htaccessContent .= "Options -Indexes\n";
    $htaccessContent .= "# Allow only specific file types\n";
    $htaccessContent .= "<FilesMatch \"\\.(php|phtml|php3|php4|php5|pl|py|jsp|asp|sh|cgi)$\">\n";
    $htaccessContent .= "    Order allow,deny\n";
    $htaccessContent .= "    Deny from all\n";
    $htaccessContent .= "</FilesMatch>\n";
    
    file_put_contents($uploadDir . '/.htaccess', $htaccessContent);
    return true;
}

echo "<h1>Samudata Database Setup</h1>\n";
echo "<p>Setting up database for Samudata application...</p>\n";

try {
    // Step 1: Create database
    echo "<p>Creating database...</p>\n";
    if (!createDatabase()) {
        echo "<p style='color: red;'>❌ Failed to create database. Please check MySQL service.</p>\n";
        exit;
    }
    echo "<p style='color: green;'>✅ Database created successfully!</p>\n";
    
    // Step 2: Test connection
    echo "<p>Testing database connection...</p>\n";
    if (!DatabaseConfig::testConnection()) {
        echo "<p style='color: red;'>❌ Database connection failed. Please check your MySQL service.</p>\n";
        echo "<p>Make sure:</p>\n";
        echo "<ul>\n";
        echo "<li>MySQL service is running</li>\n";
        echo "<li>Database credentials are correct</li>\n";
        echo "<li>Port 3306 is available</li>\n";
        echo "</ul>\n";
        exit;
    }
    
    echo "<p style='color: green;'>✅ Database connection successful!</p>\n";
    
    // Step 3: Initialize database schema
    echo "<p>Initializing database schema...</p>\n";
    if (DatabaseConfig::initializeDatabase()) {
        echo "<p style='color: green;'>✅ Database schema initialized successfully!</p>\n";
    } else {
        echo "<p style='color: red;'>❌ Failed to initialize database schema.</p>\n";
        exit;
    }
    
    // Step 4: Create upload directory
    echo "<p>Creating upload directory...</p>\n";
    if (!createUploadDirectory()) {
        echo "<p style='color: red;'>❌ Failed to create upload directory.</p>\n";
        exit;
    }
    echo "<p style='color: green;'>✅ Upload directory created and secured!</p>\n";
    
    // Step 5: Get statistics
    echo "<p>Getting database statistics...</p>\n";
    $stats = DatabaseConfig::getStats();
    if ($stats) {
        echo "<h2>Database Statistics</h2>\n";
        echo "<p>Total files: " . $stats['total_files'] . "</p>\n";
        echo "<p>Total size: " . formatBytes($stats['total_size']) . "</p>\n";
        
        echo "<h3>Categories:</h3>\n";
        echo "<ul>\n";
        foreach ($stats['categories'] as $category) {
            echo "<li>" . $category['display_name'] . ": " . $category['count'] . " files</li>\n";
        }
        echo "</ul>\n";
        
        echo "<div style='background: #f0f9ff; border: 1px solid #0ea5e9; padding: 15px; border-radius: 8px; margin: 20px 0;'>\n";
        echo "<h3 style='color: #0369a1; margin-top: 0;'>🎉 Setup Complete!</h3>\n";
        echo "<p><strong>Your Samudata application is ready to use!</strong></p>\n";
        echo "<p>Database: <code>samudata_db</code> with all tables created</p>\n";
        echo "<p>Upload directory: <code>uploads/</code> secured with .htaccess</p>\n";
        echo "<p>Default admin password: <code>dkpjatim2024</code></p>\n";
        echo "</div>\n";
        
        echo "<p><a href='login.html' style='background: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Go to Login Page</a></p>\n";
    } else {
        echo "<p style='color: orange;'>⚠️ Database setup completed but unable to get statistics.</p>\n";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>\n";
}

function formatBytes($bytes, $precision = 2) {
    $units = array('B', 'KB', 'MB', 'GB', 'TB');
    
    for ($i = 0; $bytes > 1024; $i++) {
        $bytes /= 1024;
    }
    
    return round($bytes, $precision) . ' ' . $units[$i];
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Samudata Database Setup</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #f8fafc;
        }
        h1 { color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
        h2 { color: #3b82f6; }
        h3 { color: #1e40af; }
        .success { color: #10b981; }
        .error { color: #ef4444; }
        .warning { color: #f59e0b; }
        ul { padding-left: 20px; }
        a { color: #1e40af; text-decoration: none; }
        a:hover { text-decoration: underline; }
        code { 
            background: #e2e8f0; 
            padding: 2px 6px; 
            border-radius: 4px; 
            font-family: 'Courier New', monospace;
        }
        p { line-height: 1.6; }
    </style>
</head>
<body>
</body>
</html>

