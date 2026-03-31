<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "hotel_management");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT * FROM menu_items";
$result = $conn->query($sql);

$menu = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['price'] = (float)$row['price'];
        $menu[] = $row;
    }
}

echo json_encode($menu);
$conn->close();
?>
