<?php
$servername = "hostname"; // or your server's IP address
$username = "root";
$password = "Vidak2304";
$database = "my_database";

// Create connection
$conn = new mysqli($hostname, $root, $Vidak2304, $my_database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>
