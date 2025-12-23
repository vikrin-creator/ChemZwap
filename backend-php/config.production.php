<?php
// Production Configuration for Hostinger MySQL
// Deploy this with your PHP backend

// Database Configuration
define('DB_HOST', 'localhost'); // Change to Hostinger MySQL host if different
define('DB_NAME', 'u177524058_Chemzwap');
define('DB_USER', 'u177524058_Chemzwap');
define('DB_PASS', 'Chemzwap@123');

// CORS - Allow all origins for now (update for production)
define('ALLOWED_ORIGINS', '*');

// JWT Secret
define('JWT_SECRET', 'chemzwap_jwt_secret_key_2024');

// Error reporting (disable in production)
error_reporting(0);
ini_set('display_errors', 0);
