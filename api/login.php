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

if ($data) {
    $user = $data['username'];
    $pass = $data['password'];
    
    // Search for the user in your 'users' table
    $stmt = $conn->prepare("SELECT full_name, role, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        // Compare the submitted password with the hashed password in the DB
        if (password_verify($pass, $row['password'])) {
            unset($row['password']); // Don't send the hash back to the frontend
            echo json_encode([
                "status" => "success",
                "user" => $row
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    }
}
$conn->close();
?>