<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "hotel_management");
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// 🟢 ENSURE TABLE AND COLUMNS EXIST
$conn->query("CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Check if description column exists (for backward compatibility)
$res = $conn->query("SHOW COLUMNS FROM menu_items LIKE 'description'");
if ($res->num_rows == 0) {
    $conn->query("ALTER TABLE menu_items ADD COLUMN description TEXT AFTER category");
}
$res = $conn->query("SHOW COLUMNS FROM menu_items LIKE 'category'");
if ($res->num_rows == 0) {
    $conn->query("ALTER TABLE menu_items ADD COLUMN category VARCHAR(100) AFTER item_name");
}

$data = json_decode(file_get_contents("php://input"), true);

$requiredFields = ['item_name', 'price']; // Category can be null
$allPresent = true;
foreach($requiredFields as $field) {
  if (!isset($data[$field])) { $allPresent = false; break; }
}

if ($data && $allPresent) {
    try {
        $item_name = trim($data['item_name']);
        $category = !empty(trim($data['category'] ?? '')) ? trim($data['category']) : 'Dinner';
        $description = trim($data['description'] ?? '');
        $price = (float)($data['price'] ?: 0);

        $stmt = $conn->prepare("INSERT INTO menu_items (item_name, category, description, price) VALUES (?, ?, ?, ?)");
        if (!$stmt) {
             throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param("sssd", $item_name, $category, $description, $price);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Menu item added!", "id" => $conn->insert_id, "saved_category" => $category]);
        } else {
            throw new Exception("Execution failed: " . $stmt->error);
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data. Missing: " . implode(", ", array_diff($requiredFields, array_keys($data)))]);
}
$conn->close();
?>
