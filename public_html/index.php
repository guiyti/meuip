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
    <script>
        function pingHost(host, elementId) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'ping.php?host=' + host, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    document.getElementById(elementId).innerHTML = xhr.responseText;
                }
            };
            xhr.send();
        }

        function startPing() {
            document.getElementById('pingResultUfabc').innerHTML = '<span class="blinking">Aguarde... realizando testes</span>';
            document.getElementById('pingResultGoogle').innerHTML = '<span class="blinking">Aguarde... realizando testes</span>';
            pingHost('172.17.3.69', 'pingResultUfabc');
            pingHost('8.8.8.8', 'pingResultGoogle');
        }

        window.onload = function() {
            startPing();
        };
    </script>
</head>
<body>
    <div class="container">
        <h1>Seu IP</h1>
        <p>Seu <?php echo $ipVersion; ?> é: <?php echo $userIp; ?></p>
        <h2>Testes de Conectividade</h2>
        <div class="ping-container">
            <div class="ping-box">
                <h3>Ping para www.ufabc.edu.br</h3>
                <div id="pingResultUfabc"></div>
            </div>
            <div class="ping-box">
                <h3>Ping para 8.8.8.8</h3>
                <div id="pingResultGoogle"></div>
            </div>
        </div>
    </div>
</body>
</html>
