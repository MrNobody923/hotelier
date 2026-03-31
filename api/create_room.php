<?php
// Allow cross-origin requests from your React frontend
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Update these variables with your actual database details ---
$host = 'localhost';
$dbname = 'hotel_management'; // Change to your actual database name
$username = 'root';   // Change to your actual database username
$password = '';       // Change to your actual database password

try {
    // Create a new PDO database connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Ensure the table exists and 'number' is unique at the database level if possible, 
    // or at least define the structure.
    $sqlCreate = "CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      number VARCHAR(50) UNIQUE,
      type VARCHAR(100),
      status VARCHAR(50) DEFAULT 'Available'
    )";
    $pdo->exec($sqlCreate);

    // Retrieve and decode the JSON payload sent by Axios from App.jsx
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if the required fields are present
    if (isset($data['number']) && isset($data['type'])) {
        $roomNumber = trim($data['number']);
        $roomType = $data['type'];
        $roomStatus = $data['status'] ?? 'Available';

        // 🟢 CHECK FOR DUPLICATE ROOM NUMBER
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM rooms WHERE number = :number");
        $checkStmt->execute([':number' => $roomNumber]);
        if ($checkStmt->fetchColumn() > 0) {
            http_response_code(409); // Conflict
            echo json_encode(["status" => "error", "message" => "Room number $roomNumber already exists!"]);
            exit;
        }

        // Prepare an SQL statement to prevent SQL injection
        $stmt = $pdo->prepare("INSERT INTO rooms (number, type, status) VALUES (:number, :type, :status)");
        
        $stmt->execute([
            ':number' => $roomNumber,
            ':type' => $roomType,
            ':status' => $roomStatus
        ]);

        // Return the newly created room ID back to React
        $newId = $pdo->lastInsertId();
        echo json_encode(["status" => "success", "id" => $newId, "message" => "Room created successfully!"]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    }
} catch (PDOException $e) {
    // Catch any database errors and return them as JSON
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>