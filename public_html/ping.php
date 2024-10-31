<?php
if (isset($_GET['host'])) {
    $host = escapeshellarg($_GET['host']);
    $pingResult = shell_exec("ping -c 1 $host");

    if (strpos($pingResult, '1 received') !== false || strpos($pingResult, '1 packets received') !== false) {
        echo "Conectividade externa: OK";
    } else {
        echo "Conectividade externa: Falhou";
    }
}
?>
