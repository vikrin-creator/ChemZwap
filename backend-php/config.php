<?php
// Load .env file
function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Parse KEY=VALUE
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Set as constant if not already defined
            if (!defined($key)) {
                define($key, $value);
            }
        }
    }
}

// Load environment variables
loadEnv(__DIR__ . '/.env');

// Database Configuration (fallback to hardcoded if .env not exists)
if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_USER')) define('DB_USER', 'u177524058_Chemzwap');
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', 'Chemzwap@123');
if (!defined('DB_NAME')) define('DB_NAME', 'u177524058_Chemzwap');

// JWT Secret
if (!defined('JWT_SECRET')) define('JWT_SECRET', 'chemzwap_super_secret_jwt_key_2024_hostinger_prod');

// Email Configuration
if (!defined('EMAIL_USER')) define('EMAIL_USER', 'swapchemicals@gmail.com');
if (!defined('EMAIL_PASS')) define('EMAIL_PASS', 'rvsq zyhf qmtj apqb');
if (!defined('ADMIN_EMAIL')) define('ADMIN_EMAIL', 'swapchemicals@gmail.com');

// Server Configuration
if (!defined('API_URL')) define('API_URL', 'http://localhost:8000');

// Error Reporting
$displayErrors = defined('DISPLAY_ERRORS') ? constant('DISPLAY_ERRORS') : '1';
ini_set('display_errors', $displayErrors === '1' || $displayErrors === 1 ? '1' : '0');
error_reporting(E_ALL);

// Timezone
date_default_timezone_set('Asia/Kolkata');
