<?php
// Router file for PHP built-in server
// Usage: php -S localhost:8000 router.php

// Serve static files directly
if (preg_match('/\.(?:png|jpg|jpeg|gif|css|js|ico|svg|woff|woff2|ttf|eot)$/', $_SERVER["REQUEST_URI"])) {
    return false;    // serve the requested resource as-is
}

// All other requests go through index.php
require_once __DIR__ . '/index.php';
