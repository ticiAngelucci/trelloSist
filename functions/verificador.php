<?php include("connection.php"); ?>

<?php

if(!empty($_POST["ingresar"])) {
    if (empty($_POST["username"]) and empty($_POST["password"])) {
        echo "Los campos estan vacios";
    } else {
        $username=$_POST["username"];
        $password=$_POST["password"];
        $sql=$conn->query("select * from usuarios where username='$username' and password='$password' ");
        header("location:inicio.php");
        /* if(!isset($_SESSION['username'])){
            if ($datos=$sql->fetch_object()) {
                $_SESSION['username'] = $username;
                header("location:inicio.php");
            } else {
                echo "ACCESO DENEGADO";
            }
        } */
    }
}

?>