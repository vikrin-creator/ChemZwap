<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/vendor/autoload.php';
require_once 'config.php';

class Mailer {
    public static function sendEmail($to, $subject, $htmlBody) {
        // Try Method 1: Gmail SMTP with SSL (port 465)
        $result = self::sendViaGmailSSL($to, $subject, $htmlBody);
        if ($result['success']) return $result;

        // Try Method 2: Gmail SMTP with STARTTLS (port 587)
        $result2 = self::sendViaGmailTLS($to, $subject, $htmlBody);
        if ($result2['success']) return $result2;

        // Try Method 3: PHP native mail() function (works on most shared hosting)
        $result3 = self::sendViaPHPMail($to, $subject, $htmlBody);
        return $result3;
    }

    private static function sendViaGmailSSL($to, $subject, $htmlBody) {
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = EMAIL_USER;
            $mail->Password = EMAIL_PASS;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL
            $mail->Port = 465;
            $mail->Timeout = 10;
            $mail->SMTPKeepAlive = false;

            $mail->setFrom(EMAIL_USER, 'ChemZwap Admin');
            $mail->addAddress($to);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = strip_tags($htmlBody);

            $mail->send();
            return ['success' => true, 'message' => 'Email sent via Gmail SSL'];
        } catch (Exception $e) {
            error_log("Gmail SSL failed: " . $mail->ErrorInfo);
            return ['success' => false, 'message' => $mail->ErrorInfo];
        }
    }

    private static function sendViaGmailTLS($to, $subject, $htmlBody) {
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = EMAIL_USER;
            $mail->Password = EMAIL_PASS;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // TLS
            $mail->Port = 587;
            $mail->Timeout = 10;
            $mail->SMTPKeepAlive = false;

            $mail->setFrom(EMAIL_USER, 'ChemZwap Admin');
            $mail->addAddress($to);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = strip_tags($htmlBody);

            $mail->send();
            return ['success' => true, 'message' => 'Email sent via Gmail TLS'];
        } catch (Exception $e) {
            error_log("Gmail TLS failed: " . $mail->ErrorInfo);
            return ['success' => false, 'message' => $mail->ErrorInfo];
        }
    }

    private static function sendViaPHPMail($to, $subject, $htmlBody) {
        try {
            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "Content-type: text/html; charset=UTF-8\r\n";
            $headers .= "From: ChemZwap Admin <" . EMAIL_USER . ">\r\n";
            $headers .= "Reply-To: " . EMAIL_USER . "\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion();

            $sent = mail($to, $subject, $htmlBody, $headers);
            if ($sent) {
                return ['success' => true, 'message' => 'Email sent via PHP mail()'];
            } else {
                error_log("PHP mail() failed for: $to");
                return ['success' => false, 'message' => 'PHP mail() failed'];
            }
        } catch (Exception $e) {
            error_log("PHP mail() exception: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
