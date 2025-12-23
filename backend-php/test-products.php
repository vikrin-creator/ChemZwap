<?php
// Direct test of products endpoint
require_once 'config.php';
require_once 'database.php';
require_once 'cors.php';

echo "Testing products API directly...\n\n";

// Simulate the API call
$_SERVER['REQUEST_METHOD'] = 'GET';
$_GET['route'] = 'products';

echo "Method: " . $_SERVER['REQUEST_METHOD'] . "\n";
echo "Route: " . $_GET['route'] . "\n\n";

try {
    ob_start();
    include 'api/products.php';
    $output = ob_get_clean();
    echo "Output: " . $output . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
