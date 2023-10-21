<?php include 'components/header.php'; ?>
<br>
<center>
<img src="assets/logoTelo.png" alt="logoTelo" width="228px">
    <div class="container mt-5">
    <h2>Inicio de Sesión</h2>

    <form action="functions/verificador.php" method="POST">
        <div class="form-group">
            <label for="username">Nombre de usuario:</label>
            <input type="text" class="form-control" name="username" required>
        </div>
        <div class="form-group">
            <label for="password">Contraseña:</label>
            <input type="password" class="form-control" name="password" required>
        </div>
        
        <button type="submit" name="ingresar" class="btn btn-primary">Submit</button>
    </form>
</div>


<?php include 'components/footer.php';?>