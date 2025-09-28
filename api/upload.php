<?php
/**
 * File Upload API for Samudata Application
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../database_config.php';

try {
    // Initialize database if needed
    if (!DatabaseConfig::testConnection()) {
        DatabaseConfig::initializeDatabase();
    }
    
    $fileManager = new FileManager();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Validate required fields
        $requiredFields = ['title', 'category_id', 'region_id', 'uploader_name'];
        foreach ($requiredFields as $field) {
            if (empty($_POST[$field])) {
                throw new Exception("Field '$field' is required");
            }
        }
        
        // Check if file was uploaded
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("No file uploaded or upload error occurred");
        }
        
        // Prepare metadata
        $metadata = [
            'title' => trim($_POST['title']),
            'description' => trim($_POST['description'] ?? ''),
            'category_id' => (int)$_POST['category_id'],
            'region_id' => (int)$_POST['region_id'],
            'uploader_name' => trim($_POST['uploader_name']),
            'uploader_email' => trim($_POST['uploader_email'] ?? ''),
            'upload_date' => $_POST['upload_date'] ?? date('Y-m-d'),
            'tags' => !empty($_POST['tags']) ? explode(',', $_POST['tags']) : [],
            'additional_metadata' => [
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
            ]
        ];
        
        // Upload file
        $result = $fileManager->uploadFile($_FILES['file'], $metadata);
        
        if ($result['success']) {
            http_response_code(200);
            echo json_encode($result);
        } else {
            http_response_code(400);
            echo json_encode($result);
        }
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

