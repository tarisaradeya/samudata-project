<?php
/**
 * File Download API for Samudata Application
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $fileId = $_GET['id'] ?? null;
        
        if (!$fileId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'File ID is required']);
            exit();
        }
        
        $result = $fileManager->downloadFile($fileId);
        
        if (!$result['success']) {
            http_response_code(404);
            echo json_encode($result);
            exit();
        }
        
        // Set appropriate headers for file download
        header('Content-Type: ' . $result['mime_type']);
        header('Content-Disposition: attachment; filename="' . $result['original_filename'] . '"');
        header('Content-Length: ' . $result['file_size']);
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        
        // Output file content
        readfile($result['file_path']);
        exit();
        
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

