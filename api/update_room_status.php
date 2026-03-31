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

$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data['id']) && isset($data['status'])) {
    $id = $data['id'];
    $status = $data['status'];
    
    $stmt = $conn->prepare("UPDATE rooms SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Status updated successfully!"]);
    } else {
        echo json_encode(["error" => "Failed to update status"]);
    }
} else {
    echo json_encode(["error" => "Invalid data"]);
}
$conn->close();
?>
