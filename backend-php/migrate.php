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
    $migrations_run = [];
    
    // Create categories table if not exists
    $sql = "CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    $pdo->exec($sql);
    $tables_created[] = 'categories';
    
    // Create users table if not exists (with profile fields)
    $usersSql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        full_name VARCHAR(255),
        company_name VARCHAR(255),
        gstin VARCHAR(15),
        mobile VARCHAR(15),
        reset_code VARCHAR(6),
        reset_code_expires DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    $pdo->exec($usersSql);
    $tables_created[] = 'users';
    
    // Add profile columns to users if they don't exist
    $columns = ['full_name', 'company_name', 'gstin', 'mobile'];
    foreach ($columns as $col) {
        try {
            $checkCol = $pdo->query("SHOW COLUMNS FROM users LIKE '{$col}'");
            if ($checkCol->rowCount() === 0) {
                $pdo->exec("ALTER TABLE users ADD COLUMN {$col} VARCHAR(255)");
                $migrations_run[] = "Added {$col} to users table";
            }
        } catch (Exception $e) {
            // Column might already exist
        }
    }
    
    // Create products table if not exists
    $productsSql = "CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        synonyms TEXT,
        cas_number VARCHAR(50),
        einecs VARCHAR(50),
        category VARCHAR(255),
        category_id INT,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    $pdo->exec($productsSql);
    $tables_created[] = 'products';
    
    // Create enquiries table if not exists (with user_id)
    $enquiriesSql = "CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        product_id INT,
        product_name VARCHAR(255),
        customer_name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        gstin VARCHAR(15),
        email VARCHAR(255) NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        message TEXT,
        status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    $pdo->exec($enquiriesSql);
    $tables_created[] = 'enquiries';
    
    // Add user_id column to enquiries if it doesn't exist
    try {
        $checkCol = $pdo->query("SHOW COLUMNS FROM enquiries LIKE 'user_id'");
        if ($checkCol->rowCount() === 0) {
            $pdo->exec("ALTER TABLE enquiries ADD COLUMN user_id INT AFTER id");
            $migrations_run[] = "Added user_id to enquiries table";
        }
    } catch (Exception $e) {
        // Column might already exist
    }
    
    // Fix existing image paths for categories - add /api prefix if missing
    $fixSql = "UPDATE categories SET image = CONCAT('/api', image) WHERE image IS NOT NULL AND image NOT LIKE '/api/%'";
    $pdo->exec($fixSql);
    
    // Fix existing image paths for products - add /api prefix if missing
    $fixProductsSql = "UPDATE products SET image = CONCAT('/api', image) WHERE image IS NOT NULL AND image NOT LIKE '/api/%' AND image LIKE '/uploads/%'";
    $pdo->exec($fixProductsSql);
    
    echo json_encode([
        'success' => true,
        'message' => 'Migration completed successfully',
        'tables_created' => $tables_created,
        'migrations_run' => $migrations_run
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Migration failed: ' . $e->getMessage()
    ]);
}
