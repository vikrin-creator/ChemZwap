<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
header('Content-Type: application/json');

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

// Get the route
$route = $_GET['route'] ?? '';
$parts = explode('/', $route);

// Route: GET /api/dashboard/stats
if ($method === 'GET' && $parts[0] === 'dashboard' && $parts[1] === 'stats') {
    try {
        $productsCount = $db->fetchOne('SELECT COUNT(*) as count FROM products');
        $enquiriesCount = $db->fetchOne('SELECT COUNT(*) as count FROM enquiries');
        $newEnquiriesCount = $db->fetchOne("SELECT COUNT(*) as count FROM enquiries WHERE status = 'new'");
        $contactedEnquiriesCount = $db->fetchOne("SELECT COUNT(*) as count FROM enquiries WHERE status = 'contacted'");
        $closedEnquiriesCount = $db->fetchOne("SELECT COUNT(*) as count FROM enquiries WHERE status = 'closed'");

        echo json_encode([
            'totalProducts' => (int)$productsCount['count'],
            'totalEnquiries' => (int)$enquiriesCount['count'],
            'newEnquiries' => (int)$newEnquiriesCount['count'],
            'contactedEnquiries' => (int)$contactedEnquiriesCount['count'],
            'closedEnquiries' => (int)$closedEnquiriesCount['count']
        ]);
    } catch (Throwable $e) {
        error_log("Dashboard stats error: " . $e->getMessage());
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage(), 'error_detail' => $e->getTraceAsString()]);
    }
    exit;
}

// 404 - Route not found
http_response_code(404);
echo json_encode(['message' => 'Route not found']);
