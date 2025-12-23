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
            echo json_encode(['message' => 'Email and password are required']);
            exit;
        }

        $user = $db->fetchOne(
            'SELECT * FROM users WHERE email = ?',
            [$email]
        );

        if (!$user) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid credentials']);
            exit;
        }

        if (!password_verify($password, $user['password'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid credentials']);
            exit;
        }

        $token = Auth::generateToken($user['id'], $user['email'], $user['role']);

        echo json_encode([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Server error']);
    }
    exit;
}

// Route: POST /api/auth/register
if ($method === 'POST' && $parts[0] === 'auth' && $parts[1] === 'register') {
    try {
        $username = $input['username'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $role = $input['role'] ?? 'user';

        if (empty($username) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['message' => 'All fields are required']);
            exit;
        }

        // Check if user exists
        $existing = $db->fetchOne(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [$email, $username]
        );

        if ($existing) {
            http_response_code(400);
            echo json_encode(['message' => 'User already exists']);
            exit;
        }

        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Create user
        $db->query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [$username, $email, $hashedPassword, $role]
        );

        $userId = $db->lastInsertId();
        $token = Auth::generateToken($userId, $email, $role);

        echo json_encode([
            'token' => $token,
            'user' => [
                'id' => $userId,
                'username' => $username,
                'email' => $email,
                'role' => $role
            ]
        ]);
    } catch (Exception $e) {
        error_log("Register error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Server error']);
    }
    exit;
}

// Route: GET /api/auth/me
if ($method === 'GET' && $parts[0] === 'auth' && $parts[1] === 'me') {
    try {
        $user = Auth::authenticate();
        
        $userData = $db->fetchOne(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [$user['id']]
        );

        if (!$userData) {
            http_response_code(404);
            echo json_encode(['message' => 'User not found']);
            exit;
        }

        echo json_encode($userData);
    } catch (Exception $e) {
        error_log("Get user error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Server error']);
    }
    exit;
}

// Route: POST /api/auth/forgot-password
if ($method === 'POST' && $parts[0] === 'auth' && $parts[1] === 'forgot-password') {
    try {
        $email = $input['email'] ?? '';

        if (empty($email)) {
            http_response_code(400);
            echo json_encode(['message' => 'Email is required']);
            exit;
        }

        $user = $db->fetchOne(
            'SELECT id, username FROM users WHERE email = ?',
            [$email]
        );

        if (!$user) {
            http_response_code(404);
            echo json_encode(['message' => 'No account found with this email']);
            exit;
        }

        // Generate 6-digit code
        $resetCode = sprintf("%06d", mt_rand(0, 999999));
        $expiry = date('Y-m-d H:i:s', time() + (15 * 60)); // 15 minutes

        $db->query(
            'UPDATE users SET reset_code = ?, reset_code_expires = ? WHERE id = ?',
            [$resetCode, $expiry, $user['id']]
        );

        // Send Email
        $html = "
            <div style=\"font-family: Arial, sans-serif; padding: 20px; color: #333;\">
                <h2>Password Reset Request</h2>
                <p>Hello {$user['username']},</p>
                <p>You requested a password reset for your ChemZwap Admin account.</p>
                <p>Your verification code is:</p>
                <div style=\"background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; border-radius: 8px;\">
                    {$resetCode}
                </div>
                <p>This code will expire in 15 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr />
                <p style=\"font-size: 12px; color: #777;\">ChemZwap Admin Panel</p>
            </div>
        ";

        $emailResult = Mailer::sendEmail($email, 'Your Password Reset Code', $html);

        if ($emailResult['success']) {
            echo json_encode(['success' => true, 'message' => 'Reset code sent to your email']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to send reset email']);
        }
    } catch (Exception $e) {
        error_log("Forgot password error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Server error']);
    }
    exit;
}

// Route: POST /api/auth/reset-password
if ($method === 'POST' && $parts[0] === 'auth' && $parts[1] === 'reset-password') {
    try {
        $email = $input['email'] ?? '';
        $code = $input['code'] ?? '';
        $newPassword = $input['newPassword'] ?? '';

        if (empty($email) || empty($code) || empty($newPassword)) {
            http_response_code(400);
            echo json_encode(['message' => 'All fields are required']);
            exit;
        }

        $user = $db->fetchOne(
            'SELECT id FROM users WHERE email = ? AND reset_code = ? AND reset_code_expires > NOW()',
            [$email, $code]
        );

        if (!$user) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid or expired reset code']);
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
        echo json_encode(['message' => 'Server error']);
    }
    exit;
}

// 404 - Route not found
http_response_code(404);
echo json_encode(['message' => 'Route not found']);
