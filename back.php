<?php
// get_locations.php

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

// Fetch data
$result = $conn->query("SELECT latitude, longitude, timestamp FROM locations");
$locations = [];

while($row = $result->fetch_assoc()) {
  $locations[] = $row;
}

echo json_encode($locations);

$conn->close();
?>
