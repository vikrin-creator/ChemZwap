<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/email-config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    private $config;
    
    public function __construct() {
        $this->config = EmailConfig::getConfig();
    }
    
    /**
     * Send contact form notification email
     */
    public function sendContactFormEmail($data) {
        $to = $this->config['admin_email'];
        $subject = 'New Contact Form Submission - ' . ($data['enquiry_type'] ?? 'General Inquiry');
        
        // Create HTML email body
        $htmlBody = $this->getContactFormEmailTemplate($data);
        
        // Create plain text version
        $textBody = $this->getContactFormEmailTextTemplate($data);
        
        return $this->sendEmail($to, $subject, $htmlBody, $textBody);
    }
    
    /**
     * Send enquiry notification email
     */
    public function sendEnquiryEmail($data) {
        $to = $this->config['admin_email'];
        $subject = 'New Product Enquiry - ' . ($data['product_name'] ?? 'Product');
        
        $htmlBody = $this->getEnquiryEmailTemplate($data);
        $textBody = $this->getEnquiryEmailTextTemplate($data);
        
        return $this->sendEmail($to, $subject, $htmlBody, $textBody);
    }
    
    /**
     * Core email sending function using PHPMailer
     */
    private function sendEmail($to, $subject, $htmlBody, $textBody = '') {
        try {
            $mail = new PHPMailer(true);
            
            // Server settings
            if ($this->config['use_smtp']) {
                $mail->isSMTP();
                $mail->Host = $this->config['smtp_host'];
                $mail->SMTPAuth = true;
                $mail->Username = $this->config['smtp_username'];
                $mail->Password = $this->config['smtp_password'];
                $mail->SMTPSecure = $this->config['smtp_secure'];
                $mail->Port = $this->config['smtp_port'];
            } else {
                $mail->isMail();
            }
            
            // Set charset to UTF-8
            $mail->CharSet = 'UTF-8';
            
            // Recipients
            $mail->setFrom($this->config['from_email'], $this->config['from_name']);
            $mail->addAddress($to);
            $mail->addReplyTo($this->config['reply_to_email'], $this->config['from_name']);
            
            // Content
            $mail->isHTML($this->config['enable_html']);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            
            if (!empty($textBody)) {
                $mail->AltBody = $textBody;
            }
            
            // Send email
            $result = $mail->send();
            
            error_log("Email sent successfully to: " . $to);
            return [
                'success' => true,
                'message' => 'Email sent successfully'
            ];
            
        } catch (Exception $e) {
            error_log("Email send failed: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Email could not be sent. Error: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * HTML template for contact form email
     */
    private function getContactFormEmailTemplate($data) {
        $name = htmlspecialchars($data['customer_name'] ?? 'N/A');
        $email = htmlspecialchars($data['email'] ?? 'N/A');
        $phone = htmlspecialchars($data['mobile'] ?? 'Not provided');
        $enquiryType = htmlspecialchars($data['enquiry_type'] ?? 'General');
        $message = nl2br(htmlspecialchars($data['message'] ?? 'No message provided'));
        $date = date('F j, Y g:i A');
        
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
        .value { background: white; padding: 10px; border-left: 3px solid #667eea; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 New Contact Form Submission</h1>
            <p>ChemZwap - Chemical Marketplace</p>
        </div>
        <div class="content">
            <p><strong>A new contact form has been submitted on {$date}</strong></p>
            
            <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">{$name}</div>
            </div>
            
            <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:{$email}">{$email}</a></div>
            </div>
            
            <div class="field">
                <div class="label">📱 Phone:</div>
                <div class="value">{$phone}</div>
            </div>
            
            <div class="field">
                <div class="label">📋 Enquiry Type:</div>
                <div class="value">{$enquiryType}</div>
            </div>
            
            <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value">{$message}</div>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from the ChemZwap contact form.</p>
            <p>Please respond to the customer at: <a href="mailto:{$email}" style="color: #667eea;">{$email}</a></p>
        </div>
    </div>
</body>
</html>
HTML;
    }
    
    /**
     * Plain text template for contact form email
     */
    private function getContactFormEmailTextTemplate($data) {
        $name = $data['customer_name'] ?? 'N/A';
        $email = $data['email'] ?? 'N/A';
        $phone = $data['mobile'] ?? 'Not provided';
        $enquiryType = $data['enquiry_type'] ?? 'General';
        $message = $data['message'] ?? 'No message provided';
        $date = date('F j, Y g:i A');
        
        return <<<TEXT
NEW CONTACT FORM SUBMISSION
ChemZwap - Chemical Marketplace

Submitted on: {$date}

Name: {$name}
Email: {$email}
Phone: {$phone}
Enquiry Type: {$enquiryType}

Message:
{$message}

---
Please respond to the customer at: {$email}
TEXT;
    }
    
    /**
     * HTML template for product enquiry email
     */
    private function getEnquiryEmailTemplate($data) {
        $name = htmlspecialchars($data['customer_name'] ?? 'N/A');
        $email = htmlspecialchars($data['email'] ?? 'N/A');
        $phone = htmlspecialchars($data['mobile'] ?? 'Not provided');
        $company = htmlspecialchars($data['company_name'] ?? 'Not provided');
        $gstin = htmlspecialchars($data['gstin'] ?? 'Not provided');
        $productName = htmlspecialchars($data['product_name'] ?? 'N/A');
        $message = nl2br(htmlspecialchars($data['message'] ?? 'No additional message'));
        $date = date('F j, Y g:i A');
        
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
        .value { background: white; padding: 10px; border-left: 3px solid #667eea; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 New Product Enquiry</h1>
            <p>ChemZwap - Chemical Marketplace</p>
        </div>
        <div class="content">
            <p><strong>A new product enquiry has been received on {$date}</strong></p>
            
            <div class="field">
                <div class="label">🏷️ Product:</div>
                <div class="value">{$productName}</div>
            </div>
            
            <div class="field">
                <div class="label">👤 Customer Name:</div>
                <div class="value">{$name}</div>
            </div>
            
            <div class="field">
                <div class="label">🏢 Company:</div>
                <div class="value">{$company}</div>
            </div>
            
            <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:{$email}">{$email}</a></div>
            </div>
            
            <div class="field">
                <div class="label">📱 Phone:</div>
                <div class="value">{$phone}</div>
            </div>
            
            <div class="field">
                <div class="label">🔢 GSTIN:</div>
                <div class="value">{$gstin}</div>
            </div>
            
            <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value">{$message}</div>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from the ChemZwap product enquiry form.</p>
            <p>Please respond to the customer at: <a href="mailto:{$email}" style="color: #667eea;">{$email}</a></p>
        </div>
    </div>
</body>
</html>
HTML;
    }
    
    /**
     * Plain text template for product enquiry email
     */
    private function getEnquiryEmailTextTemplate($data) {
        $name = $data['customer_name'] ?? 'N/A';
        $email = $data['email'] ?? 'N/A';
        $phone = $data['mobile'] ?? 'Not provided';
        $company = $data['company_name'] ?? 'Not provided';
        $gstin = $data['gstin'] ?? 'Not provided';
        $productName = $data['product_name'] ?? 'N/A';
        $message = $data['message'] ?? 'No additional message';
        $date = date('F j, Y g:i A');
        
        return <<<TEXT
NEW PRODUCT ENQUIRY
ChemZwap - Chemical Marketplace

Submitted on: {$date}

Product: {$productName}
Customer Name: {$name}
Company: {$company}
Email: {$email}
Phone: {$phone}
GSTIN: {$gstin}

Message:
{$message}

---
Please respond to the customer at: {$email}
TEXT;
    }
}
