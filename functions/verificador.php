<?php
include("connection.php");
session_start(); // Inicia la sesión

    if (empty($_POST["username"]) or empty($_POST["password"])) {
        echo "Los campos están vacíos";
    } else {
        $username = $_POST["username"];
        $password = $_POST["password"];
        $sql = $conn->query("select * from usuarios where username='$username' and password='$password' ");

        if ($datos = $sql->fetch_object()) {
            // Establece la variable de sesión para el usuario autenticado
            $_SESSION['username'] = $username;
            header("location:../index.php");
        } else {
            echo "ACCESO DENEGADO";
        }
    }

?>
