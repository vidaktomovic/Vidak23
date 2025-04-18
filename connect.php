<?php
$servername = "localhost"; // or your server's IP address
$username = "your_username";
$password = "your_password";
$database = "your_database_name";

// Create connection
$conn = new mysqli($hostname, $root, $Vidak2304, $my_database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>
