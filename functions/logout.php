<?php
session_start(); // Iniciar la sesión si aún no está iniciada
session_unset(); // Eliminar todas las variables de sesión
session_destroy(); // Destruir la sesión

// Redirigir a la página de inicio de sesión o a cualquier otra página
header('Location: ../login.php'); // Cambia 'login.php' por la página a la que quieras redirigir
exit();
?>