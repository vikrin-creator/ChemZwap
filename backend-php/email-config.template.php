<?php
/**
 * Email Configuration Template
 * 
 * COPY THIS FILE TO email-config.php AND UPDATE WITH YOUR ACTUAL CREDENTIALS
 * DO NOT COMMIT email-config.php TO VERSION CONTROL
 */

class EmailConfig {
    // Email Settings
    const FROM_EMAIL = 'noreply@chemzwap.com';
    const FROM_NAME = 'ChemZwap';
    const REPLY_TO_EMAIL = 'info@chemzwap.com';
    const ADMIN_EMAIL = 'info@chemzwap.com';
    
    // SMTP Configuration
    const USE_SMTP = true;
    
    // SMTP Server Settings
    // For Hostinger: smtp.hostinger.com, port 587
    // For Gmail: smtp.gmail.com, port 587
    // For Outlook: smtp-mail.outlook.com, port 587
    const SMTP_HOST = 'smtp.hostinger.com';
    const SMTP_PORT = 587;
    const SMTP_SECURE = 'tls'; // 'tls' or 'ssl'
    
    // SMTP Authentication
    // REPLACE THESE WITH YOUR ACTUAL CREDENTIALS
    const SMTP_USERNAME = 'your-email@yourdomain.com';
    const SMTP_PASSWORD = 'your-password';
    
    // Email Templates
    const ENABLE_HTML = true;
    
    public static function getConfig() {
        return [
            'use_smtp' => self::USE_SMTP,
            'smtp_host' => self::SMTP_HOST,
            'smtp_port' => self::SMTP_PORT,
            'smtp_secure' => self::SMTP_SECURE,
            'smtp_username' => self::SMTP_USERNAME,
            'smtp_password' => self::SMTP_PASSWORD,
            'from_email' => self::FROM_EMAIL,
            'from_name' => self::FROM_NAME,
            'reply_to_email' => self::REPLY_TO_EMAIL,
            'admin_email' => self::ADMIN_EMAIL,
            'enable_html' => self::ENABLE_HTML,
        ];
    }
    
    public static function isConfigured() {
        if (!self::USE_SMTP) {
            return true;
        }
        
        return self::SMTP_USERNAME !== 'your-email@yourdomain.com' 
            && self::SMTP_PASSWORD !== 'your-password';
    }
}
