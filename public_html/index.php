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

        function testInternalConnectivity() {
            document.getElementById('pingResultInternal').innerHTML = '<span class="blinking">Aguarde... realizando teste de conectividade interna</span>';
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'test_internal.php', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    document.getElementById('pingResultInternal').innerHTML = 'Conectividade interna: OK';
                } else if (xhr.readyState == 4) {
                    document.getElementById('pingResultInternal').innerHTML = 'Conectividade interna: Falhou';
                }
            };
            xhr.send();
        }

        function testExternalConnectivity() {
            document.getElementById('pingResultExternal').innerHTML = '<span class="blinking">Aguarde... realizando teste de conectividade externa</span>';
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'ping.php?host=8.8.8.8', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    document.getElementById('pingResultExternal').innerHTML = xhr.responseText;
                }
            };
            xhr.send();
        }

        function startTests() {
            testInternalConnectivity();
            testExternalConnectivity();
        }

        window.onload = function() {
            startTests();
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
                <h3>Seu dispositivo e a rede da UFABC</h3>
                <div id="pingResultInternal"></div>
            </div>
            <div class="ping-box">
                <h3>UFABC e a Internet</h3>
                <div id="pingResultExternal"></div>
            </div>
        </div>
    </div>
</body>
</html>
