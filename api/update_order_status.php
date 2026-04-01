<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['status'])) {
    echo json_encode(["status" => "error", "message" => "Required data missing."]);
    exit;
}

$conn = new mysqli("localhost", "root", "", "hotel_management");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

$id = $conn->real_escape_string($data['id']);
$status = $conn->real_escape_string($data['status']);

$sql = "UPDATE food_orders SET status = '$status' WHERE id = '$id'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Order updated to $status"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error updating order: " . $conn->error]);
}

$conn->close();
?>
