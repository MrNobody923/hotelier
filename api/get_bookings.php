<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "hotel_management");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// Fetch bookings joined with rooms to get room details
$sql = "SELECT b.id, b.room_id, b.guest_name, b.check_in, b.check_out, b.status as booking_status, b.created_at, r.number as room_number, r.type as room_type, r.status as room_status 
        FROM bookings b 
        LEFT JOIN rooms r ON b.room_id = r.id 
        ORDER BY b.created_at DESC";
$result = $conn->query($sql);

$bookings = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
}
echo json_encode($bookings);

$conn->close();
?>
