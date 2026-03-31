<?php
// Allow React (on a different port) to access this script
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Database configuration
$host = "localhost";
$user = "root";
$pass = "";
$db   = "hotel_management";

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Fetch rooms
$sql = "SELECT * FROM rooms";
$result = $conn->query($sql);

$rooms = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $rooms[] = $row;
    }
}

// Return data as JSON
echo json_encode($rooms);

$conn->close();
?>