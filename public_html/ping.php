<?php
require_once '../src/IpService.php';

if (isset($_GET['host'])) {
    $ipService = new IpService();
    $host = $_GET['host'];
    $pingResult = shell_exec("ping -c 5 $host");

    if (strpos($pingResult, '0 received') !== false) {
        echo "Conectividade com $host: Falhou";
    } else {
        echo "Conectividade com $host: OK";
    }
}
?>
