<?php
if (isset($_GET['host'])) {
    $host = escapeshellarg($_GET['host']);
    $pingResult = shell_exec("ping -c 5 $host");
    $lines = explode("\n", $pingResult);
    $times = [];

    foreach ($lines as $line) {
        if (preg_match('/time=([0-9\.]+) ms/', $line, $matches)) {
            $times[] = $matches[1];
        }
    }

    header('Content-Type: application/json');
    echo json_encode($times);
}
?>
