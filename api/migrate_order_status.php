<?php
$conn = new mysqli("localhost", "root", "", "hotel_management");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "ALTER TABLE food_orders ADD COLUMN status VARCHAR(50) DEFAULT 'Pending' AFTER special_instructions";
if ($conn->query($sql) === TRUE) {
    echo "Column 'status' added successfully.";
} else {
    echo "Error adding column: " . $conn->error;
}

$conn->close();
?>
