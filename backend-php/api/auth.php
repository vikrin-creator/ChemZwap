<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../mailer.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Get the route
$route = $_GET['route'] ?? '';
$parts = explode('/', $route);

// Route: POST /api/auth/login
if ($method === 'POST' && $parts[0] === 'auth' && $parts[1] === 'login') {
    try {
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email and password are required']);
            exit;
        }

        $user = $db->fetchOne(
            'SELECT * FROM users WHERE email = ?',
            [$email]
        );

        if (!$user) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
            exit;
        }

        if (!password_verify($password, $user['password'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
            exit;
        }

        $token = Auth::generateToken($user['id'], $user['email'], $user['role']);

        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role'],
                'full_name' => $user['full_name'] ?? '',
                'company_name' => $user['company_name'] ?? '',
                'gstin' => $user['gstin'] ?? '',
                'mobile' => $user['mobile'] ?? ''
            ]
        ]);
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    exit;
}

// Route: POST /api/auth/register
if ($method === 'POST' && $parts[0] === 'auth' && $parts[1] === 'register') {
    try {
        // Accept both formats
        $fullName = $input['full_name'] ?? $input['fullName'] ?? $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $companyName = $input['company_name'] ?? $input['companyName'] ?? '';
        $gstin = $input['gstin'] ?? '';
        $mobile = $input['mobile'] ?? '';
        $role = 'user'; // Always register as user

        // Use email as username - it's always unique (avoids duplicate username constraint)
        $username = $email;

        if (empty($fullName) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name, email, and password are required']);
            exit;
        }

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid email format']);
            exit;
        }

        // Validate password length
        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
            exit;
        }

        // Check if user exists
        $existing = $db->fetchOne(
            'SELECT id FROM users WHERE email = ?',
            [$email]
        );

        if ($existing) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email already registered']);
            exit;
        }

        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Create user with profile fields
        $db->query(
            'INSERT INTO users (username, email, password, role, full_name, company_name, gstin, mobile) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [$username, $email, $hashedPassword, $role, $fullName, $companyName, $gstin, $mobile]
        );

        $userId = $db->lastInsertId();
        $token = Auth::generateToken($userId, $email, $role);

        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $userId,
                'username' => $username,
                'email' => $email,
                'role' => $role,
                'full_name' => $fullName,
                'company_name' => $companyName,
                'gstin' => $gstin,
                'mobile' => $mobile
            ]
        ]);
    } catch (Exception $e) {
        error_log("Register error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
    exit;
}

// Route: GET /api/auth/me
if ($method === 'GET' && $parts[0] === 'auth' && $parts[1] === 'me') {
    try {
        $user = Auth::authenticate();
        
        $userData = $db->fetchOne(
            'SELECT id, username, email, role, full_name, company_name, gstin, mobile, created_at FROM users WHERE id = ?',
            [$user['id']]
        );

        if (!$userData) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'User not found']);
            exit;
        }

        echo json_encode([
            'success' => true,
            'user' => $userData
        ]);
    } catch (Exception $e) {
        error_log("Get user error: " . $e->getMessage());
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    }
    exit;
}

// Route: PUT /api/auth/profile
if ($method === 'PUT' && $parts[0] === 'auth' && $parts[1] === 'profile') {
    try {
        $user = Auth::authenticate();
        
        $fullName = $input['full_name'] ?? $input['fullName'] ?? '';
        $companyName = $input['company_name'] ?? $input['companyName'] ?? '';
        $gstin = $input['gstin'] ?? '';
        $mobile = $input['mobile'] ?? '';

        if (empty($fullName)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name is required']);
            exit;
        }

        $db->query(
            'UPDATE users SET full_name = ?, company_name = ?, gstin = ?, mobile = ?, username = ? WHERE id = ?',
            [$fullName, $companyName, $gstin, $mobile, $fullName, $user['id']]
        );

        // Fetch updated user data
        $userData = $db->fetchOne(
            'SELECT id, username, email, role, full_name, company_name, gstin, mobile FROM users WHERE id = ?',
            [$user['id']]
        );

        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $userData
        ]);
    } catch (Exception $e) {
        error_log("Update profile error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    exit;
}

// Route: PUT /api/auth/change-password
if ($method === 'PUT' && $parts[0] === 'auth' && $parts[1] === 'change-password') {
    try {
        $user = Auth::authenticate();
        
        $currentPassword = $input['currentPassword'] ?? $input['current_password'] ?? '';
        $newPassword = $input['newPassword'] ?? $input['new_password'] ?? '';

        if (empty($currentPassword) || empty($newPassword)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Current and new passwords are required']);
            exit;
        }

        if (strlen($newPassword) < 6) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'New password must be at least 6 characters']);
            exit;
        }

        // Get current user
        $userData = $db->fetchOne('SELECT password FROM users WHERE id = ?', [$user['id']]);

        if (!password_verify($currentPassword, $userData['password'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
            exit;
        }

        // Update password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $db->query('UPDATE users SET password = ? WHERE id = ?', [$hashedPassword, $user['id']]);

        echo json_encode([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    } catch (Exception $e) {
        error_log("Change password error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    exit;
}

// Route: POST /api/auth/forgot-password
if ($method === 'POST' && $parts[0] === 'auth' && $parts[1] === 'forgot-password') {
    try {
        $email = $input['email'] ?? '';

        if (empty($email)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email is required']);
            exit;
        }

        $user = $db->fetchOne(
            'SELECT id, username, full_name FROM users WHERE email = ?',
            [$email]
        );

        if (!$user) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'No account found with this email']);
            exit;
        }

        // Generate 6-digit code
        $resetCode = sprintf("%06d", mt_rand(0, 999999));
        $expiry = date('Y-m-d H:i:s', time() + (15 * 60)); // 15 minutes

        $db->query(
            'UPDATE users SET reset_code = ?, reset_code_expires = ? WHERE id = ?',
            [$resetCode, $expiry, $user['id']]
        );

        $displayName = $user['full_name'] ?: $user['username'];

        // Send Email
        $html = "
            <div style=\"font-family: Arial, sans-serif; padding: 20px; color: #333;\">
                <h2>Password Reset Request</h2>
                <p>Hello {$displayName},</p>
                <p>You requested a password reset for your ChemZwap account.</p>
                <p>Your verification code is:</p>
                <div style=\"background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; border-radius: 8px;\">
                    {$resetCode}
                </div>
                <p>This code will expire in 15 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr />
                <p style=\"font-size: 12px; color: #777;\">ChemZwap - Sustainable Chemical Marketplace</p>
            </div>
        ";

        $emailResult = Mailer::sendEmail($email, 'Your Password Reset Code', $html);

        if ($emailResult['success']) {
            echo json_encode(['success' => true, 'message' => 'Reset code sent to your email']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to send reset email']);
        }
    } catch (Exception $e) {
        error_log("Forgot password error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    exit;
}

// Route: POST /api/auth/reset-password
if ($method === 'POST' && $parts[0] === 'auth' && $parts[1] === 'reset-password') {
    try {
        $email = $input['email'] ?? '';
        $code = $input['code'] ?? '';
        $newPassword = $input['newPassword'] ?? $input['new_password'] ?? '';

        if (empty($email) || empty($code) || empty($newPassword)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'All fields are required']);
            exit;
        }

        if (strlen($newPassword) < 6) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
            exit;
        }

        $user = $db->fetchOne(
            'SELECT id FROM users WHERE email = ? AND reset_code = ? AND reset_code_expires > NOW()',
            [$email, $code]
        );

        if (!$user) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid or expired reset code']);
            exit;
        }

        // Hash new password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        // Update password and clear reset fields
        $db->query(
            'UPDATE users SET password = ?, reset_code = NULL, reset_code_expires = NULL WHERE email = ?',
            [$hashedPassword, $email]
        );

        echo json_encode(['success' => true, 'message' => 'Password reset successfully']);
    } catch (Exception $e) {
        error_log("Reset password error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    exit;
}

// 404 - Route not found
http_response_code(404);
echo json_encode(['success' => false, 'message' => 'Route not found']);
