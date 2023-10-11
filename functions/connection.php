<?php
$server = "localhost";
$usernameBD = "root";
$passwordBD = "";
$database = "trelloSist";

// Crear una conexión
$conn = mysqli_connect($server, $usernameBD, $passwordBD, $database);

// Verificar la conexión
if (!$conn) {
    die("La conexión a la base de datos ha fallado: " . mysqli_connect_error());
}
echo "Conexión exitosa.";
?>
