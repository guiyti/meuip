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
}
?>
