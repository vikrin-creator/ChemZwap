<?php
require_once 'config.php';
require_once 'database.php';

echo "Testing Database Connection...\n\n";

echo "DB_HOST: " . DB_HOST . "\n";
echo "DB_USER: " . DB_USER . "\n";
echo "DB_NAME: " . DB_NAME . "\n\n";

try {
    $db = Database::getInstance();
    echo "✅ Database connection successful!\n\n";
    
    // Test a simple query
    $conn = $db->getConnection();
    $result = $conn->query("SELECT 1 as test");
    $row = $result->fetch();
    
    if ($row['test'] == 1) {
        echo "✅ Query execution successful!\n\n";
    }
    
    // Try to fetch products
    echo "Testing products query...\n";
    $stmt = $db->query("SELECT COUNT(*) as count FROM products");
    $result = $stmt->fetch();
    echo "✅ Found " . $result['count'] . " products in database\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
