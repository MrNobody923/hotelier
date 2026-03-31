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
    $guest = $data['guest_name'];
    $room_id = $data['room_id'];
    $in = $data['check_in'];
    $out = $data['check_out'];
    
    // 1. Insert the booking
    $stmt = $conn->prepare("INSERT INTO bookings (guest_name, room_id, check_in, check_out) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siss", $guest, $room_id, $in, $out);
    
    if ($stmt->execute()) {
        // 2. Automatically update room status to 'Occupied'
        $conn->query("UPDATE rooms SET status = 'Occupied' WHERE id = $room_id");
        echo json_encode(["message" => "Reservation successful!"]);
    } else {
        echo json_encode(["error" => "Booking failed"]);
    }
}
$conn->close();
?>