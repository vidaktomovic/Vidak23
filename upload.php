<?php
// upload.php

// Database connection
$host = 'localhost';
$db = 'photo_app';
$user = 'your_username';
$pass = 'your_password';

$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

try {
  $pdo = new PDO($dsn, $user, $pass);
} catch (PDOException $e) {
  echo json_encode(['error' => 'Database connection failed']);
  exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['image'])) {
  echo json_encode(['error' => 'No image data received']);
  exit;
}

// Extract base64 image data
$imageData = $data['image'];
$imageData = str_replace('data:image/png;base64,', '', $imageData);
$imageData = str_replace(' ', '+', $imageData);
$image = base64_decode($imageData);

$latitude = isset($data['latitude']) ? $data['latitude'] : null;
$longitude = isset($data['longitude']) ? $data['longitude'] : null;

// Insert into database
$sql = "INSERT INTO photos (
::contentReference[oaicite:13]{index=13}
 
