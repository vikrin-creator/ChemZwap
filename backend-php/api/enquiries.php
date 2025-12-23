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

// Route: POST /api/enquiries (public - no auth)
if ($method === 'POST' && $parts[0] === 'enquiries' && !isset($parts[1])) {
    try {
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
            'INSERT INTO enquiries (product_id, product_name, customer_name, company_name, gstin, email, mobile, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [$productId, $productName, $customerName, $companyName, $gstin, $email, $mobile, $message]
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

// Route: GET /api/enquiries (admin only)
if ($method === 'GET' && $parts[0] === 'enquiries') {
    try {
        Auth::authenticate();

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
if ($method === 'PUT' && $parts[0] === 'enquiries' && isset($parts[1]) && $parts[2] === 'status') {
    try {
        Auth::authenticate();

        $enquiryId = $parts[1];
        $status = $input['status'] ?? '';

        if (!in_array($status, ['new', 'contacted', 'closed'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Valid status (new, contacted, closed) is required']);
            exit;
        }

        $db->query(
            'UPDATE enquiries SET status = ? WHERE id = ?',
            [$status, $enquiryId]
        );

        echo json_encode(['message' => 'Enquiry status updated successfully']);
    } catch (Exception $e) {
        error_log("Update enquiry error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Server error']);
    }
    exit;
}

// Route: DELETE /api/enquiries/:id (admin only)
if ($method === 'DELETE' && $parts[0] === 'enquiries' && isset($parts[1])) {
    try {
        Auth::authenticate();

        $enquiryId = $parts[1];

        $db->query('DELETE FROM enquiries WHERE id = ?', [$enquiryId]);

        echo json_encode(['message' => 'Enquiry deleted successfully']);
    } catch (Exception $e) {
        error_log("Delete enquiry error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Server error']);
    }
    exit;
}

// 404 - Route not found
http_response_code(404);
echo json_encode(['message' => 'Route not found']);
