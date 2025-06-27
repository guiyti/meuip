// modules/ip-utils.js
const os = require('os');

/**
 * Obtém os endereços IPv4 e IPv6 do servidor
 * @returns {Object} Objeto contendo ipv4 e ipv6
 */
function getServerIPs() {
    const interfaces = os.networkInterfaces();
    let ipv4 = null;
    let ipv6 = null;

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Ignora interfaces de loopback (127.0.0.1, ::1)
            if (!iface.internal) {
                if (iface.family === 'IPv4' && !ipv4) {
                    ipv4 = iface.address;
                } else if (iface.family === 'IPv6' && !ipv6 && !iface.address.startsWith('fe80')) {
                    // Ignora endereços IPv6 link-local (fe80::)
                    ipv6 = iface.address;
                }
            }
        }
    }

    return { ipv4, ipv6 };
}

/**
 * Categoriza IPs em IPv4 e IPv6
 * @param {Array} ipList Lista de IPs a serem categorizados
 * @returns {Object} Objeto com ipv4 e ipv6 categorizados
 */
function categorizeIPs(ipList) {
    const ips = { ipv4: 'Não detectado', ipv6: 'Não detectado' };
    
    if (!ipList || ipList.length === 0) {
        return ips;
    }
    
    ipList.forEach(ip => {
        const cleaned = ip.replace(/^::ffff:/, ''); // Remove prefixo IPv4-mapped
        
        if (cleaned.includes('.') && cleaned !== '127.0.0.1') {
            // É IPv4 e não é localhost
            ips.ipv4 = cleaned;
        } else if (cleaned.includes(':') && !cleaned.startsWith('fe80:') && cleaned !== '::1') {
            // É IPv6, não é link-local e não é localhost
            ips.ipv6 = cleaned;
        }
    });

    return ips;
}

module.exports = {
    getServerIPs,
    categorizeIPs
};