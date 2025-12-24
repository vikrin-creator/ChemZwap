<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

// Support for _method override (since PHP doesn't parse FormData for PUT/DELETE)
// This allows us to use POST with _method=PUT for updates
if ($method === 'POST' && isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
}

$input = json_decode(file_get_contents('php://input'), true);

// Get the route
$route = $_GET['route'] ?? '';
$parts = explode('/', $route);

// Route: GET /api/products or GET /api/products/:id
if ($method === 'GET' && $parts[0] === 'products') {
    try {
        if (isset($parts[1]) && is_numeric($parts[1])) {
            // Get single product
            $product = $db->fetchOne(
                'SELECT * FROM products WHERE id = ?',
                [$parts[1]]
            );

            if (!$product) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Product not found']);
                exit;
            }

            echo json_encode(['success' => true, 'data' => $product]);
        } else {
            // Get all products
            $products = $db->fetchAll('SELECT * FROM products ORDER BY created_at DESC');
            echo json_encode(['success' => true, 'data' => $products]);
        }
    } catch (Exception $e) {
        error_log("Get products error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
    exit;
}

// Route: POST /api/products (admin only)
if ($method === 'POST' && $parts[0] === 'products' && !isset($parts[1])) {
    try {
        Auth::authenticate();

        // Handle both JSON and FormData
        $name = '';
        $synonyms = null;
        $casNumber = null;
        $einecs = null;
        $category = null;
        $imagePath = null;

        // Check if it's FormData (multipart/form-data) or JSON
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strpos($contentType, 'multipart/form-data') !== false || strpos($contentType, 'application/x-www-form-urlencoded') !== false) {
            // Handle FormData from POST
            $name = $_POST['productName'] ?? $_POST['name'] ?? '';
            $synonyms = $_POST['synonyms'] ?? null;
            $casNumber = $_POST['casNumber'] ?? $_POST['cas_number'] ?? null;
            $einecs = $_POST['einecs'] ?? null;
            $category = $_POST['category'] ?? null;
            
            // Handle file upload if present
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../uploads/';
                
                // Create uploads directory if it doesn't exist
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                
                // Validate file type
                $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                $fileType = $_FILES['image']['type'];
                
                if (in_array($fileType, $allowedTypes)) {
                    // Generate unique filename
                    $extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                    $filename = 'product-' . time() . '-' . rand(100000, 999999) . '.' . $extension;
                    $uploadPath = $uploadDir . $filename;
                    
                    // Move uploaded file
                    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
                        $imagePath = '/uploads/' . $filename;
                    }
                }
            }
        } else {
            // Handle JSON
            $name = $input['productName'] ?? $input['name'] ?? '';
            $synonyms = $input['synonyms'] ?? null;
            $casNumber = $input['casNumber'] ?? $input['cas_number'] ?? null;
            $einecs = $input['einecs'] ?? null;
            $category = $input['category'] ?? null;
        }

        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Product name is required']);
            exit;
        }

        $db->query(
            'INSERT INTO products (product_name, synonyms, cas_number, einecs, category, image) VALUES (?, ?, ?, ?, ?, ?)',
            [$name, $synonyms, $casNumber, $einecs, $category, $imagePath]
        );

        $productId = $db->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Product created successfully',
            'id' => $productId
        ]);
    } catch (Exception $e) {
        error_log("Create product error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
    exit;
}

// Route: PUT /api/products/:id (admin only)
if ($method === 'PUT' && $parts[0] === 'products' && isset($parts[1])) {
    try {
        Auth::authenticate();

        $productId = $parts[1];
        
        // With _method override, data comes from $_POST
        $name = $_POST['productName'] ?? $_POST['name'] ?? '';
        $synonyms = $_POST['synonyms'] ?? null;
        $casNumber = $_POST['casNumber'] ?? $_POST['cas_number'] ?? null;
        $einecs = $_POST['einecs'] ?? null;
        $category = $_POST['category'] ?? null;

        // Fallback to JSON input if $_POST is empty (for non-FormData requests)
        if (empty($name) && $input) {
            $name = $input['productName'] ?? $input['name'] ?? '';
            $synonyms = $input['synonyms'] ?? null;
            $casNumber = $input['casNumber'] ?? $input['cas_number'] ?? null;
            $einecs = $input['einecs'] ?? null;
            $category = $input['category'] ?? null;
        }

        error_log("PUT /api/products/$productId - Name: $name, Synonyms: $synonyms, CAS: $casNumber");

        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Product name is required']);
            exit;
        }

        $result = $db->query(
            'UPDATE products SET product_name = ?, synonyms = ?, cas_number = ?, einecs = ?, category = ? WHERE id = ?',
            [$name, $synonyms, $casNumber, $einecs, $category, $productId]
        );

        echo json_encode([
            'success' => true,
            'message' => 'Product updated successfully'
        ]);
    } catch (Exception $e) {
        error_log("Update product error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
    exit;
}

// Route: DELETE /api/products/:id (admin only)
if ($method === 'DELETE' && $parts[0] === 'products' && isset($parts[1])) {
    try {
        Auth::authenticate();

        $productId = $parts[1];

        $db->query('DELETE FROM products WHERE id = ?', [$productId]);

        echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
    } catch (Exception $e) {
        error_log("Delete product error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    exit;
}

// 404 - Route not found
http_response_code(404);
echo json_encode(['message' => 'Route not found']);
