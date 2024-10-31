<?php
require_once '../src/IpService.php';

$ipService = new IpService();
$userIp = $ipService->getUserIp();
$ipVersion = $ipService->getIpVersion($userIp);
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu IP</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Seu IP</h1>
    <p>Seu <?php echo $ipVersion; ?> é: <?php echo $userIp; ?></p>
</body>
</html>
