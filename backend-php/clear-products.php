<?php
/**
 * Clear all products from database
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

echo "Clearing all products from database...\n";

try {
    $db = Database::getInstance();
    $db->query('DELETE FROM products');
    $count = $db->fetchOne('SELECT COUNT(*) as count FROM products');
    echo "✅ All products deleted!\n";
    echo "Products remaining: " . $count['count'] . "\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
