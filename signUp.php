<?php
include 'components/header.php';
?>
<div class="container mt-5">
    <h2>Registro de Usuario</h2>
    <form action="functions/register.php" method="POST">
        <div class="form-group">
            <label for="username">Nombre de usuario:</label>
            <input type="text" class="form-control" name="username" required>
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="mail" class="form-control" name="email" required>
        </div>
        <div class="form-group">
            <label for="password">Contraseña:</label>
            <input type="password" class="form-control" name="password" required>
        </div>
        <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
</div>
<?php
include 'components/footer.php';
?>