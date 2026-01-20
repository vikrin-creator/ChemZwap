<?php
/**
 * Email Configuration
 * 
 * Configure SMTP settings for sending emails via PHPMailer
 * Update these settings with your actual SMTP credentials
 */

class EmailConfig {
    // Email Settings
    const FROM_EMAIL = 'noreply@chemzwap.com';
    const FROM_NAME = 'ChemZwap';
    const REPLY_TO_EMAIL = 'info@chemzwap.com';
    const ADMIN_EMAIL = 'sainithin95054@gmail.com'; // All contact form emails will be sent here
    
    // SMTP Configuration
    // Option 1: Use Hostinger SMTP (Recommended if you have Hostinger hosting)
    // Option 2: Use Gmail SMTP
    // Option 3: Use Outlook/Office365 SMTP
    
    // Set this to true to enable SMTP, false to use PHP mail()
    const USE_SMTP = true;
    
    // SMTP Server Settings - Configured for Gmail
    const SMTP_HOST = 'smtp.gmail.com';
    const SMTP_PORT = 587;
    const SMTP_SECURE = 'tls'; // 'tls' or 'ssl'
    
    // SMTP Authentication - Gmail Credentials
    const SMTP_USERNAME = 'sainithin95054@gmail.com';
    const SMTP_PASSWORD = 'mpsxwgsquhvehygs'; // Gmail App Password
    
    // Email Templates
    const ENABLE_HTML = true;
    
    /**
     * Get SMTP configuration array
     */
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
    
    /**
     * Check if SMTP is properly configured
     */
    public static function isConfigured() {
        if (!self::USE_SMTP) {
            return true; // Using PHP mail(), always available
        }
        
        return self::SMTP_USERNAME !== 'your-email@yourdomain.com' 
            && self::SMTP_PASSWORD !== 'your-password';
    }
}
