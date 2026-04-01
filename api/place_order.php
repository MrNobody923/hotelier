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
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Ensure the table exists with modern columns
$sqlCreate = "CREATE TABLE IF NOT EXISTS food_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guest_name VARCHAR(255),
  room_number VARCHAR(50),
  item_name VARCHAR(255),
  quantity INT DEFAULT 1,
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($sqlCreate);

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $guest_name = $data['guest_name'] ?? 'Unknown Guest';
    $room_number = $data['room_number'] ?? 'N/A';
    $item_name = $data['item_name'] ?? 'N/A';
    $quantity = $data['quantity'] ?? 1;
    $special_instructions = $data['special_instructions'] ?? '';
    
    $status = $data['status'] ?? 'Pending';
    
    $stmt = $conn->prepare("INSERT INTO food_orders (guest_name, room_number, item_name, quantity, special_instructions, status) VALUES (?, ?, ?, ?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("ssisss", $guest_name, $room_number, $item_name, $quantity, $special_instructions, $status);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Order placed successfully!"]);
        } else {
            echo json_encode(["error" => "Failed to place order: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["error" => "SQL Prepare failed: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "No data provided"]);
}
$conn->close();
?>
