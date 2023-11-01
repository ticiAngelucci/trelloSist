<?php
session_start(); // Iniciar la sesión

if (!isset($_SESSION['username'])) {
    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    header('Location: login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>MyNote®</title>
<<<<<<< HEAD
    <link rel="icon" href="assets/pencil.ico">

=======
>>>>>>> 005b47e3d737808303c0216ac8785658db5cb8bf

    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha512-SfTiTlX6kk+qitfevl/7LibUOeJWlt9rbyDn92a1DqWOw9vWG2MFoays0sgObmWazO5BQPiFucnnEAjpAB+/Sw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>

<body>
    <header>
        <div class="header-flex">
            <span id="sidebar-button"><i class="fa fa-list"></i></span>
            <h1 id="title" class="text-align-center">MyNote®</h1>
            <span class="title-actions-container" style="font-size:25px;cursor:pointer;letter-spacing: 1ch;">
                <p id="user-info">
                    <?php
                    // Mostrar el nombre del usuario si está disponible en la sesión
                    if (isset($_SESSION['username'])) {
                        echo '¡Hola, ' . $_SESSION['username'] . '!';
                    }
                    ?>
                </p>
                <i title="Eliminar tablero." id="delete-button" class="fa fa-trash"></i>
<<<<<<< HEAD
                <i title="Guardar tablero." id="save-button" class="fa fa-floppy-o"></i>
=======
                <i title="Guardar tablero." id "save-button" class="fa fa-floppy-o"></i>
>>>>>>> 005b47e3d737808303c0216ac8785658db5cb8bf
                <a href="functions/logout.php"><i title="Cerrar sesión" id="logout-button" class="fa fa-sign-out"></i></a>
            </span>
        </div>
    </header>


    <div id="sidebar" class="sidenav">
        <span id="sidebar-close">&times;</span>
        <p class="is-title">Escritorios</p>
        <ul id="boards-list">
<<<<<<< HEAD
            <!--Aqui se mostraran los escritorios... -->
=======
            <!-- Boards will be listed here... -->
>>>>>>> 005b47e3d737808303c0216ac8785658db5cb8bf
        </ul>

        <div class="flex-col">
            <input type="text" id="add-board-text" name="add-board" placeholder="Añadir Escritorio...">
            <button id="add-board-button">Añadir Escritorios</button>
        </div>
    </div>

    <div id="card-context-menu" class="context-menu">
<<<<<<< HEAD
        <!-- Click derecho en las opciones de tabla -->
=======
        <!-- Right-click context menu on cards. -->
>>>>>>> 005b47e3d737808303c0216ac8785658db5cb8bf
        <ul>
            <li id="card-context-menu-delete">Eliminar</li>
            <li id="card-context-menu-clear">Vaciar</li>
            <li id="card-context-menu-duplicate">Duplicar</li>
        </ul>
    </div>

    <div class="container" id="main-container">
        <div id="cards-container">
            <div id="add-card">
                <input maxlength="128" type="text" id="add-card-text" name="add-card" placeholder="Añadir tabla..." autofocus>
                <button id="add-card-button" class="plus-button">+</button>
            </div>
        </div>
    </div>

    <div id="alert-container">
        <div id="alerts">
            <!-- alerts go here -->
        </div>
    </div>

    <div id="confirm-dialog" class="modal">
        <div class="dialog-content">
            <span id="confirm-dialog-close" class="confirm-dialog-close">&times;</span>
            <div id="confirm-dialog-text" class="confirm-dialog-text"></div>
            <div class="confirm-dialog-actions">
                <button id="confirm-dialog-cancel" class="confirm-dialog-cancel"> Cancelar </button>
                <button id="confirm-dialog-confirm" class="confirm-dialog-confirm"> Confirmar </button>
            </div>
        </div>
    </div>

    <script src="js/main.js"></script>
</body>

</html>