<?php

class IpService {
    public function getUserIp() {
        return $_SERVER['REMOTE_ADDR'];
    }

    public function getIpVersion($ip) {
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return 'IPv4';
        } elseif (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            return 'IPv6';
        } else {
            return 'Unknown';
        }
    }

    public function testConnectivity($host) {
        $pingResult = shell_exec("ping -c 1 $host");
        if (strpos($pingResult, '1 received') !== false) {
            return "Conectividade com $host: OK";
        } else {
            return "Conectividade com $host: Falhou";
        }
    }

    public function pingHost($host) {
        $pingResult = shell_exec("ping -c 5 $host");
        return nl2br($pingResult);
    }

    public function getUserIps() {
        $ips = [];
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ips[] = $_SERVER['HTTP_CLIENT_IP'];
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = array_merge($ips, explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']));
        }
        $ips[] = $_SERVER['REMOTE_ADDR'];
        return array_unique($ips);
    }
}
?>
