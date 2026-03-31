<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// The restaurants table doesn't seem to exist in your MySQL instance.
// Returning an empty array to prevent Frontend Axios exceptions.
$conn = new mysqli("localhost", "root", "", "hotel_management");
if ($conn->connect_error) {
    die(json_encode([]));
}

$restaurants = [];

// Try fetching if it exists
$sql = "SHOW TABLES LIKE 'restaurants'";
$result = $conn->query($sql);
if ($result && $result->num_rows > 0) {
    $sql = "SELECT * FROM restaurants";
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $restaurants[] = $row;
        }
    }
}

echo json_encode($restaurants);
$conn->close();
?>
