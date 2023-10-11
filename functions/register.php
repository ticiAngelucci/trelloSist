<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recupera los datos del formulario
    $username = $_POST["username"];
    $email = $_POST["email"];
    $password = $_POST["password"];
    
    include 'connection.php';
    
    // Inserta los datos en la tabla de usuarios 
    $sql = "INSERT INTO usuarios (username, email, password) VALUES ('$username', '$email', '$password')";
    
    if (mysqli_query($conn, $sql)) {
        echo "¡Registro exitoso! Bienvenido, $username";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }

    // Cierra la conexión a la base de datos
    mysqli_close($conn);
}
?>
