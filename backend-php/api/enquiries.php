<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Get the route
$route = $_GET['route'] ?? '';
$parts = explode('/', $route);

// Route: POST /api/enquiries (public - but check for optional auth)
if ($method === 'POST' && $parts[0] === 'enquiries' && !isset($parts[1])) {
    try {
        // Try to get user ID if logged in (optional)
        $userId = null;
        try {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['HTTP_X_AUTHORIZATION'] ?? '';
            if (!empty($authHeader)) {
                $user = Auth::authenticate();
                $userId = $user['id'];
            }
        } catch (Exception $e) {
            // User not logged in, continue without user_id
        }

        $productId = $input['product_id'] ?? $input['productId'] ?? null;
        $productName = $input['product_name'] ?? $input['productName'] ?? '';
        $customerName = $input['customer_name'] ?? $input['name'] ?? $input['customerName'] ?? '';
        $companyName = $input['company_name'] ?? $input['companyName'] ?? null;
        $gstin = $input['gstin'] ?? null;
        $email = $input['email'] ?? '';
        $mobile = $input['mobile'] ?? '';
        $message = $input['message'] ?? null;

        if (empty($productName) || empty($customerName) || empty($email) || empty($mobile)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Product name, customer name, email, and mobile are required'
            ]);
            exit;
        }

        $db->query(
            'INSERT INTO enquiries (user_id, product_id, product_name, customer_name, company_name, gstin, email, mobile, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [$userId, $productId, $productName, $customerName, $companyName, $gstin, $email, $mobile, $message]
        );

        $enquiryId = $db->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Enquiry submitted successfully',
            'id' => $enquiryId
        ]);
    } catch (Exception $e) {
        error_log("Create enquiry error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    exit;
}

// Route: GET /api/enquiries/mine (user - get own enquiries)
if ($method === 'GET' && $parts[0] === 'enquiries' && isset($parts[1]) && $parts[1] === 'mine') {
    try {
        $user = Auth::authenticate();

        $enquiries = $db->fetchAll(
            'SELECT * FROM enquiries WHERE user_id = ? ORDER BY created_at DESC',
            [$user['id']]
        );
        
        echo json_encode(['success' => true, 'data' => $enquiries]);
    } catch (Exception $e) {
        error_log("Get user enquiries error: " . $e->getMessage());
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    }
    exit;
}

// Route: GET /api/enquiries (admin only)
if ($method === 'GET' && $parts[0] === 'enquiries') {
    try {
        $user = Auth::authenticate();
        
        // Check if user is admin
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Admin access required']);
            exit;
        }

        $enquiries = $db->fetchAll('SELECT * FROM enquiries ORDER BY created_at DESC');
        echo json_encode(['success' => true, 'data' => $enquiries]);
    } catch (Exception $e) {
        error_log("Get enquiries error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    exit;
}

// Route: PUT /api/enquiries/:id/status (admin only)
if ($method === 'PUT' && $parts[0] === 'enquiries' && isset($parts[1]) && isset($parts[2]) && $parts[2] === 'status') {
    try {
        $user = Auth::authenticate();
        
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Admin access required']);
            exit;
        }

        $enquiryId = $parts[1];
        $status = $input['status'] ?? '';

        if (!in_array($status, ['new', 'contacted', 'closed'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Valid status (new, contacted, closed) is required']);
            exit;
        }

        $db->query(
            'UPDATE enquiries SET status = ? WHERE id = ?',
            [$status, $enquiryId]
        );

        echo json_encode(['success' => true, 'message' => 'Enquiry status updated successfully']);
    } catch (Exception $e) {
        error_log("Update enquiry error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    exit;
}

// Route: DELETE /api/enquiries/:id (admin only)
if ($method === 'DELETE' && $parts[0] === 'enquiries' && isset($parts[1])) {
    try {
        $user = Auth::authenticate();
        
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Admin access required']);
            exit;
        }

        $enquiryId = $parts[1];

        $db->query('DELETE FROM enquiries WHERE id = ?', [$enquiryId]);

        echo json_encode(['success' => true, 'message' => 'Enquiry deleted successfully']);
    } catch (Exception $e) {
        error_log("Delete enquiry error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    exit;
}

// 404 - Route not found
http_response_code(404);
echo json_encode(['success' => false, 'message' => 'Route not found']);
