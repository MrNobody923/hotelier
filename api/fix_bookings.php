<?php
$conn = new mysqli("localhost", "root", "", "hotel_management");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ensure the bookings table accepts the guest_name parameter passed from React
$sql1 = "ALTER TABLE bookings ADD guest_name VARCHAR(100) DEFAULT NULL";
if ($conn->query($sql1) === TRUE) {
    echo "Added guest_name column\n";
} else {
    echo "Error adding column: " . $conn->error . "\n";
}

// Make sure user_id is nullable if they aren't passing it
$sql2 = "ALTER TABLE bookings MODIFY user_id INT(11) NULL";
if ($conn->query($sql2) === TRUE) {
    echo "Modified user_id to accept NULL\n";
} else {
    echo "Error modifying column: " . $conn->error . "\n";
}

$conn->close();
?>
