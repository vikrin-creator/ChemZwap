<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

// Support for _method override (since PHP doesn't parse FormData for PUT/DELETE)
if ($method === 'POST' && isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
}

$input = json_decode(file_get_contents('php://input'), true);

// Get the route
$route = $_GET['route'] ?? '';
$parts = explode('/', $route);

// Route: GET /api/categories
if ($method === 'GET' && $parts[0] === 'categories') {
    try {
        if (isset($parts[1]) && is_numeric($parts[1])) {
            // Get single category
            $category = $db->fetchOne(
                'SELECT * FROM categories WHERE id = ?',
                [$parts[1]]
            );

            if (!$category) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Category not found']);
                exit;
            }

            echo json_encode(['success' => true, 'data' => $category]);
        } else {
            // Get all categories
            $categories = $db->fetchAll('SELECT * FROM categories ORDER BY name ASC');
            echo json_encode(['success' => true, 'data' => $categories]);
        }
    } catch (Exception $e) {
        error_log("Get categories error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
    exit;
}

// Route: POST /api/categories (admin only)
if ($method === 'POST' && $parts[0] === 'categories' && !isset($parts[1])) {
    try {
        Auth::authenticate();

        $name = '';
        $imagePath = null;

        // Check if it's FormData or JSON
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strpos($contentType, 'multipart/form-data') !== false || strpos($contentType, 'application/x-www-form-urlencoded') !== false) {
            $name = $_POST['name'] ?? '';
            
            // Handle file upload
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../uploads/categories/';
                
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                
                $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
                $fileType = $_FILES['image']['type'];
                
                if (in_array($fileType, $allowedTypes)) {
                    $extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                    $filename = 'category-' . time() . '-' . rand(100000, 999999) . '.' . $extension;
                    $uploadPath = $uploadDir . $filename;
                    
                    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
                        $imagePath = '/api/uploads/categories/' . $filename;
                    }
                }
            }
        } else {
            $name = $input['name'] ?? '';
        }

        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Category name is required']);
            exit;
        }

        $db->query(
            'INSERT INTO categories (name, image) VALUES (?, ?)',
            [$name, $imagePath]
        );

        $categoryId = $db->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Category created successfully',
            'id' => $categoryId
        ]);
    } catch (Exception $e) {
        error_log("Create category error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
    exit;
}

// Route: PUT /api/categories/:id (admin only)
if ($method === 'PUT' && $parts[0] === 'categories' && isset($parts[1])) {
    try {
        Auth::authenticate();

        $categoryId = $parts[1];
        
        $name = $_POST['name'] ?? '';
        $imagePath = null;
        $updateImage = false;

        // Handle file upload if present
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../uploads/categories/';
            
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
            $fileType = $_FILES['image']['type'];
            
            if (in_array($fileType, $allowedTypes)) {
                $extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $filename = 'category-' . time() . '-' . rand(100000, 999999) . '.' . $extension;
                $uploadPath = $uploadDir . $filename;
                
                if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
                    $imagePath = '/api/uploads/categories/' . $filename;
                    $updateImage = true;
                }
            }
        }

        // Fallback to JSON input
        if (empty($name) && $input) {
            $name = $input['name'] ?? '';
        }

        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Category name is required']);
            exit;
        }

        if ($updateImage) {
            $db->query(
                'UPDATE categories SET name = ?, image = ? WHERE id = ?',
                [$name, $imagePath, $categoryId]
            );
        } else {
            $db->query(
                'UPDATE categories SET name = ? WHERE id = ?',
                [$name, $categoryId]
            );
        }

        echo json_encode([
            'success' => true,
            'message' => 'Category updated successfully'
        ]);
    } catch (Exception $e) {
        error_log("Update category error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
    exit;
}

// Route: DELETE /api/categories/:id (admin only)
if ($method === 'DELETE' && $parts[0] === 'categories' && isset($parts[1])) {
    try {
        Auth::authenticate();

        $categoryId = $parts[1];

        $db->query('DELETE FROM categories WHERE id = ?', [$categoryId]);

        echo json_encode(['success' => true, 'message' => 'Category deleted successfully']);
    } catch (Exception $e) {
        error_log("Delete category error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
    exit;
}

// 404 - Route not found
http_response_code(404);
echo json_encode(['message' => 'Route not found']);
