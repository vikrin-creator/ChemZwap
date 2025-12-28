<?php
/**
 * Database Migration Script
 * Run this once to create necessary tables
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

header('Content-Type: application/json');

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    $tables_created = [];
    
    // Create categories table if not exists
    $sql = "CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    $pdo->exec($sql);
    $tables_created[] = 'categories';
    
    // Fix existing image paths - add /api prefix if missing
    $fixSql = "UPDATE categories SET image = CONCAT('/api', image) WHERE image IS NOT NULL AND image NOT LIKE '/api/%'";
    $pdo->exec($fixSql);
    
    echo json_encode([
        'success' => true,
        'message' => 'Migration completed successfully',
        'tables_created' => $tables_created
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Migration failed: ' . $e->getMessage()
    ]);
}
