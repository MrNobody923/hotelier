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
$db_user = "root"; // Your database username
$db_pass = "";     // Your database password
$db_name = "hotel_management"; // Match the database name in login.php

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}
// Read incoming JSON data
$data = json_decode(file_get_contents("php://input"));

// Check if data was received properly
if (!isset($data->username) || !isset($data->password) || !isset($data->full_name) || !isset($data->email)) {
    echo json_encode(["status" => "error", "message" => "Incomplete data provided"]);
    exit();
}

$fullName = $conn->real_escape_string($data->full_name);
$email = $conn->real_escape_string($data->email);
$username = $conn->real_escape_string($data->username);
$role = isset($data->role) ? $conn->real_escape_string($data->role) : "customer";
$hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);

// Check if username already exists
$checkQuery = "SELECT id FROM users WHERE username = '$username' OR email = '$email'";
$result = $conn->query($checkQuery);

if ($result->num_rows != 0) {
    echo json_encode(["status" => "error", "message" => "Username or email already exists"]);
    exit();
}

// Insert the new user
$insertQuery = "INSERT INTO users (full_name, email, username, password, role) VALUES ('$fullName', '$email', '$username', '$hashedPassword', '$role')";

if ($conn->query($insertQuery) === TRUE) {
    echo json_encode(["status" => "success", "message" => "User registered successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error creating user: " . $conn->error]);
}

$conn->close();
?>
