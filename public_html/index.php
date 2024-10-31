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
    <title>Meu IP / Minha Vida</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script>
        function pingHost(host, elementId) {
            console.log(host);
            document.getElementById(elementId).innerHTML = '<span class="blinking">Aguarde... realizando testes</span>';
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'ping.php?host=' + host, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    const times = JSON.parse(xhr.responseText);
                    displayPingTimes(times, elementId);
                }
            };
            xhr.send();
        }

        function displayPingTimes(times, elementId) {
            let index = 0;
            const resultElement = document.getElementById(elementId);
            resultElement.innerHTML = ''; // Limpa o conteúdo anterior
            const interval = setInterval(function() {
                if (index < times.length) {
                    const time = times[index];
                    resultElement.innerHTML += 'Ping ' + (index + 1) + ': ' + time + ' ms<br>';
                    index++;
                } else {
                    clearInterval(interval);
                    resultElement.innerHTML += '<br>Testes OK';
                }
            }, 1000);
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(function() {
                alert('IP copiado para a área de transferência');
            }, function(err) {
                console.error('Erro ao copiar IP: ', err);
            });
        }

        function startTests() {
            pingHost('<?php echo $userIp; ?>', 'pingResultInternal');
            pingHost('8.8.8.8', 'pingResultExternal');
        }

        window.onload = function() {
            startTests();
        };
    </script>
    <style>
        .ip-box {
            display: inline-block;
            background-color: #e6e6e6;
            padding: 5px 10px;
            border-radius: 5px;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Meu IP / Minha Vida</h1>
        <p><?php echo $ipVersion; ?>: <span class="ip-box"><?php echo $userIp; ?></span>
            <i class="fa-regular fa-copy" title="Copiar IP" style="cursor: pointer;" onclick="copyToClipboard('<?php echo $userIp; ?>')"></i>
        </p>
        <h2>Testes de Conectividade</h2>
        <div class="ping-container">
            <div class="ping-box">
                <h3>Seu Dispositivo - UFABC</h3>
                <div id="pingResultInternal"></div>
            </div>
            <div class="ping-box">
                <h3>UFABC - Internet</h3>
                <div id="pingResultExternal"></div>
            </div>
        </div>
    </div>
</body>
</html>
