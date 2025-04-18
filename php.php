<?php
// save_location.php

// Database connection parameters
$host = 'localhost';
$db   = 'your_database';
$user = 'your_username';
$pass = 'your_password';

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$latitude = $data['latitude'];
$longitude = $data['longitude'];

// Insert into database
$stmt = $conn->prepare("INSERT INTO locations (latitude, longitude) VALUES (?, ?)");
$stmt->bind_param("dd", $latitude, $longitude);
$stmt->execute();
$stmt->close();
$conn->close();

echo json_encode(['status' => 'success']);
?>
