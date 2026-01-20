<?php
/**
 * Email Configuration Test Script
 * 
 * This script tests if your email configuration is working correctly
 * Run this file directly in your browser: http://localhost:8000/test-email-config.php
 */

require_once __DIR__ . '/email-config.php';
require_once __DIR__ . '/EmailService.php';

// Set content type to HTML
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Email Configuration Test - ChemZwap</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        .status {
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            font-weight: bold;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .warning {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        .info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        pre {
            background: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background: #5568d3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📧 Email Configuration Test</h1>
        
        <?php
        $config = EmailConfig::getConfig();
        $isConfigured = EmailConfig::isConfigured();
        
        echo '<h2>Configuration Status</h2>';
        
        if ($isConfigured) {
            echo '<div class="status success">✓ SMTP Configuration Detected</div>';
        } else {
            echo '<div class="status error">✗ SMTP Not Configured</div>';
            echo '<div class="status warning">';
            echo 'Please update your credentials in <code>email-config.php</code><br>';
            echo 'See <code>EMAIL_SETUP_GUIDE.md</code> for instructions.';
            echo '</div>';
        }
        
        echo '<h2>Current Settings</h2>';
        echo '<pre>';
        echo "SMTP Enabled: " . ($config['use_smtp'] ? 'Yes' : 'No (using PHP mail)') . "\n";
        echo "SMTP Host: " . $config['smtp_host'] . "\n";
        echo "SMTP Port: " . $config['smtp_port'] . "\n";
        echo "SMTP Security: " . $config['smtp_secure'] . "\n";
        echo "SMTP Username: " . $config['smtp_username'] . "\n";
        echo "SMTP Password: " . (strlen($config['smtp_password']) > 0 ? str_repeat('*', strlen($config['smtp_password'])) : '[NOT SET]') . "\n\n";
        echo "From Email: " . $config['from_email'] . "\n";
        echo "From Name: " . $config['from_name'] . "\n";
        echo "Admin Email: " . $config['admin_email'] . "\n";
        echo "Reply-To Email: " . $config['reply_to_email'] . "\n";
        echo '</pre>';
        
        // Check PHPMailer
        echo '<h2>PHPMailer Status</h2>';
        if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            echo '<div class="status success">✓ PHPMailer is installed and available</div>';
        } else {
            echo '<div class="status error">✗ PHPMailer not found. Run: composer install</div>';
        }
        
        // Test button
        if ($isConfigured && isset($_GET['test'])) {
            echo '<h2>Send Test Email</h2>';
            
            try {
                $emailService = new EmailService();
                
                $testData = [
                    'customer_name' => 'Test User',
                    'email' => $config['admin_email'],
                    'mobile' => '+1 (555) 123-4567',
                    'enquiry_type' => 'Test',
                    'message' => 'This is a test email from the ChemZwap email configuration test script. If you receive this, your email setup is working correctly!'
                ];
                
                $result = $emailService->sendContactFormEmail($testData);
                
                if ($result['success']) {
                    echo '<div class="status success">';
                    echo '✓ Test email sent successfully!<br>';
                    echo 'Check your inbox at: ' . $config['admin_email'];
                    echo '</div>';
                } else {
                    echo '<div class="status error">';
                    echo '✗ Failed to send test email<br>';
                    echo 'Error: ' . htmlspecialchars($result['message']);
                    echo '</div>';
                }
            } catch (Exception $e) {
                echo '<div class="status error">';
                echo '✗ Exception occurred: ' . htmlspecialchars($e->getMessage());
                echo '</div>';
            }
        } elseif ($isConfigured) {
            echo '<div class="info status">';
            echo 'Configuration looks good! Click the button below to send a test email.';
            echo '</div>';
            echo '<a href="?test=1" class="button">Send Test Email</a>';
        }
        
        echo '<h2>Next Steps</h2>';
        echo '<ol>';
        
        if (!$isConfigured) {
            echo '<li>Update SMTP credentials in <code>email-config.php</code></li>';
            echo '<li>Read <code>EMAIL_SETUP_GUIDE.md</code> for detailed instructions</li>';
            echo '<li>Refresh this page to check your configuration</li>';
        } else {
            echo '<li>✓ Configuration is set up</li>';
            echo '<li>Click "Send Test Email" button above to test</li>';
            echo '<li>Check your email inbox at: ' . $config['admin_email'] . '</li>';
            echo '<li>If successful, your contact form will now send emails automatically!</li>';
        }
        
        echo '</ol>';
        
        echo '<p><strong>Note:</strong> This test script should be removed or secured before deploying to production.</p>';
        ?>
    </div>
</body>
</html>
