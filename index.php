<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>IP Local do Usuário</title>
</head>
<body>
    <h1>Informações de IP Local</h1>
    <?php
        $ip_cliente = $_SERVER['REMOTE_ADDR'];

        // Verifica se o endereço é IPv4 ou IPv6
        if (strpos($ip_cliente, ':') === false) {
            echo "<p>Seu IP Local IPv4: $ip_cliente</p>";
        } else {
            echo "<p>Seu IP Local IPv6: $ip_cliente</p>";
        }
    ?>
</body>
</html>