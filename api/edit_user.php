<?php
// Allow requests from your React app
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "hotel_management";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

$data = json_decode(file_get_contents("php://input"));

// Make sure all required fields are provided
if (!isset($data->id) || !isset($data->full_name) || !isset($data->email) || !isset($data->username)) {
    echo json_encode(["status" => "error", "message" => "Incomplete data provided"]);
    exit();
}

$id = $conn->real_escape_string($data->id);
$full_name = $conn->real_escape_string($data->full_name);
$email = $conn->real_escape_string($data->email);
$username = $conn->real_escape_string($data->username);
$role = isset($data->role) ? $conn->real_escape_string($data->role) : "customer";

$updateQuery = "UPDATE users SET full_name='$full_name', email='$email', username='$username', role='$role' WHERE id='$id'";

if ($conn->query($updateQuery) === TRUE) {
    echo json_encode(["status" => "success", "message" => "User updated successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error updating user: " . $conn->error]);
}

$conn->close();
?>
