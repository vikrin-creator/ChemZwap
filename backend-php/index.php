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
    $route = trim($route, '/');
    
    // Remove 'api/' prefix if present
    if (strpos($route, 'api/') === 0) {
        $route = substr($route, 4);
    }
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
} elseif (strpos($route, 'dashboard') === 0) {
    require_once __DIR__ . '/api/dashboard.php';
} elseif ($route === 'health' || $route === 'api/health') {
    // Health check
    echo json_encode(['status' => 'ok', 'timestamp' => date('c')]);
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Route not found', 'route' => $route]);
}
