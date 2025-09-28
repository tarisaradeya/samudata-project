<?php
/**
 * Files API for Samudata Application
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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
        $action = $_GET['action'] ?? 'list';
        
        switch ($action) {
            case 'list':
                // Get files with optional filters
                $filters = [];
                if (!empty($_GET['category'])) {
                    $filters['category'] = $_GET['category'];
                }
                if (!empty($_GET['region'])) {
                    $filters['region'] = $_GET['region'];
                }
                if (!empty($_GET['search'])) {
                    $filters['search'] = $_GET['search'];
                }
                if (!empty($_GET['limit'])) {
                    $filters['limit'] = (int)$_GET['limit'];
                }
                
                $files = $fileManager->getFiles($filters);
                
                // Format file data for frontend
                $formattedFiles = array_map(function($file) {
                    return [
                        'id' => $file['id'],
                        'title' => $file['title'],
                        'description' => $file['description'],
                        'filename' => $file['original_filename'],
                        'size' => $file['file_size'],
                        'category' => $file['category_name'],
                        'region' => $file['region_name'],
                        'uploader' => $file['uploader_name'],
                        'upload_date' => $file['upload_date'],
                        'download_count' => $file['download_count'],
                        'is_favorite' => (bool)$file['is_favorite'],
                        'created_at' => $file['created_at'],
                        'tags' => json_decode($file['tags'] ?? '[]', true)
                    ];
                }, $files);
                
                echo json_encode([
                    'success' => true,
                    'data' => $formattedFiles,
                    'total' => count($formattedFiles)
                ]);
                break;
                
            case 'categories':
                $categories = $fileManager->getCategories();
                echo json_encode([
                    'success' => true,
                    'data' => $categories
                ]);
                break;
                
            case 'regions':
                $regions = $fileManager->getRegions();
                echo json_encode([
                    'success' => true,
                    'data' => $regions
                ]);
                break;
                
            case 'stats':
                $stats = DatabaseConfig::getStats();
                if ($stats) {
                    echo json_encode([
                        'success' => true,
                        'data' => $stats
                    ]);
                } else {
                    throw new Exception("Failed to get statistics");
                }
                break;
                
            case 'download':
                // Download file
                $fileId = $_GET['id'] ?? null;
                if (!$fileId) {
                    throw new Exception("File ID is required");
                }
                
                $result = $fileManager->downloadFile($fileId);
                if ($result['success']) {
                    // Log the download
                    $fileManager->logFileAccess($fileId, 'download');
                    
                    // Return file info for download
                    echo json_encode($result);
                } else {
                    throw new Exception($result['message']);
                }
                break;
                
            case 'logs':
                // Get activity logs
                $startDate = $_GET['start_date'] ?? date('Y-m-d', strtotime('-30 days'));
                $endDate = $_GET['end_date'] ?? date('Y-m-d');
                $actionFilter = $_GET['action_filter'] ?? '';
                
                $logs = $fileManager->getActivityLogs($startDate, $endDate, $actionFilter);
                echo json_encode([
                    'success' => true,
                    'data' => $logs
                ]);
                break;
                
            case 'log_stats':
                // Get log statistics
                $stats = $fileManager->getLogStatistics();
                echo json_encode([
                    'success' => true,
                    'data' => $stats
                ]);
                break;
                
            case 'requests':
                // Get file requests
                $statusFilter = $_GET['status_filter'] ?? '';
                $priorityFilter = $_GET['priority_filter'] ?? '';
                $categoryFilter = $_GET['category_filter'] ?? '';
                
                $requests = $fileManager->getFileRequests($statusFilter, $priorityFilter, $categoryFilter);
                echo json_encode([
                    'success' => true,
                    'data' => $requests
                ]);
                break;
                
            case 'request_stats':
                // Get request statistics
                $stats = $fileManager->getRequestStatistics();
                echo json_encode([
                    'success' => true,
                    'data' => $stats
                ]);
                break;
                
            case 'export_logs':
                // Export logs as CSV
                $startDate = $_GET['start_date'] ?? date('Y-m-d', strtotime('-30 days'));
                $endDate = $_GET['end_date'] ?? date('Y-m-d');
                $actionFilter = $_GET['action_filter'] ?? '';
                
                $fileManager->exportLogs($startDate, $endDate, $actionFilter);
                exit; // Don't return JSON for file download
                break;
                
            default:
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid action'
                ]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $action = $_POST['action'] ?? 'upload';
        
        switch ($action) {
            case 'favorite':
                // Toggle favorite status
                $fileId = $_POST['file_id'] ?? null;
                if (!$fileId) {
                    throw new Exception("File ID is required");
                }
                
                $result = $fileManager->toggleFavorite($fileId);
                echo json_encode($result);
                break;
                
            case 'archive':
                // Archive file
                $fileId = $_POST['file_id'] ?? null;
                if (!$fileId) {
                    throw new Exception("File ID is required");
                }
                
                $result = $fileManager->archiveFile($fileId);
                echo json_encode($result);
                break;
                
            case 'delete':
                // Delete file
                $fileId = $_POST['file_id'] ?? null;
                if (!$fileId) {
                    throw new Exception("File ID is required");
                }
                
                $result = $fileManager->deleteFile($fileId);
                echo json_encode($result);
                break;
                
            case 'edit':
                // Edit file metadata
                $fileId = $_POST['file_id'] ?? null;
                if (!$fileId) {
                    throw new Exception("File ID is required");
                }
                
                $metadata = [
                    'title' => $_POST['title'] ?? '',
                    'description' => $_POST['description'] ?? '',
                    'tags' => !empty($_POST['tags']) ? explode(',', $_POST['tags']) : []
                ];
                
                $result = $fileManager->editFile($fileId, $metadata);
                echo json_encode($result);
                break;
                
            case 'create_request':
                // Create file request
                $requestData = [
                    'title' => $_POST['title'] ?? '',
                    'description' => $_POST['description'] ?? '',
                    'category' => $_POST['category'] ?? '',
                    'priority' => $_POST['priority'] ?? '',
                    'deadline' => $_POST['deadline'] ?? null,
                    'requester_name' => $_POST['requester_name'] ?? ''
                ];
                
                $result = $fileManager->createFileRequest($requestData);
                echo json_encode($result);
                break;
                
            case 'update_request_status':
                // Update request status
                $requestId = $_POST['request_id'] ?? null;
                $status = $_POST['status'] ?? '';
                
                if (!$requestId || !$status) {
                    throw new Exception("Request ID and status are required");
                }
                
                $result = $fileManager->updateRequestStatus($requestId, $status);
                echo json_encode($result);
                break;
                
            default:
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid action'
                ]);
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

