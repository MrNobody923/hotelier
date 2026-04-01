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

if (!isset($data['id']) || !isset($data['number']) || !isset($data['type'])) {
    echo json_encode(["status" => "error", "message" => "Required data missing."]);
    exit;
}

$conn = new mysqli("localhost", "root", "", "hotel_management");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

$id = $conn->real_escape_string($data['id']);
$number = $conn->real_escape_string($data['number']);
$type = $conn->real_escape_string($data['type']);
$price = isset($data['price']) ? $conn->real_escape_string($data['price']) : 0;
$status = isset($data['status']) ? $conn->real_escape_string($data['status']) : "Available";

$sql = "UPDATE rooms SET number = '$number', type = '$type', price = '$price', status = '$status' WHERE id = '$id'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Room updated successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error updating room: " . $conn->error]);
}

$conn->close();
?>
