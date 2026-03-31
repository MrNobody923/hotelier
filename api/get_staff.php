<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "hotel_management";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Fetch all staff members from the database (exclude regular customers)
$sql = "SELECT id, full_name, email, username, role FROM users WHERE role != 'customer'";
$result = $conn->query($sql);

$staff = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $staff[] = $row;
    }
}

echo json_encode($staff);

$conn->close();
?>