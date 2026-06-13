<?php
require_once 'cors.php';

// Router - Handle both Apache and PHP built-in server
$requestUri = $_SERVER['REQUEST_URI'];
$route = '';

// Check if route is in query string (from .htaccess rewrite)
if (isset($_GET['route'])) {
    $route = $_GET['route'];
} else {
    // Parse from URI for PHP built-in server
    $route = parse_url($requestUri, PHP_URL_PATH);
}

// Normalize route (remove leading/trailing slashes, replace multiple slashes with single)
$route = trim($route, '/');
$route = preg_replace('#/+#', '/', $route);

// Remove 'api/' prefix if present
if (strpos($route, 'api/') === 0) {
    $route = substr($route, 4);
    $route = ltrim($route, '/');
}

// Set route in $_GET for API handlers
$_GET['route'] = $route;

// Route to appropriate handler
if (strpos($route, 'auth') === 0) {
    require_once __DIR__ . '/api/auth.php';
} elseif (strpos($route, 'products') === 0) {
    require_once __DIR__ . '/api/products.php';
} elseif (strpos($route, 'enquiries') === 0) {
    require_once __DIR__ . '/api/enquiries.php';
} elseif (strpos($route, 'categories') === 0) {
    require_once __DIR__ . '/api/categories.php';
} elseif (strpos($route, 'dashboard') === 0) {
    require_once __DIR__ . '/api/dashboard.php';
} elseif ($route === 'health' || $route === 'api/health') {
    // Health check
    echo json_encode(['status' => 'ok', 'timestamp' => date('c')]);
} elseif ($route === 'test-db') {
    // Database connection test
    header('Content-Type: application/json');
    try {
        require_once __DIR__ . '/config.php';
        require_once __DIR__ . '/database.php';
        
        $db = Database::getInstance();
        $stmt = $db->query("SELECT COUNT(*) as count FROM products");
        $result = $stmt->fetch();
        
        echo json_encode([
            'status' => 'ok',
            'db_host' => DB_HOST,
            'db_name' => DB_NAME,
            'products_count' => $result['count']
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage(),
            'db_host' => defined('DB_HOST') ? DB_HOST : 'not defined',
            'db_name' => defined('DB_NAME') ? DB_NAME : 'not defined'
        ]);
    }
    exit;
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Route not found', 'route' => $route]);
}
