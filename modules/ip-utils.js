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
    
    // Primeiro, tentar encontrar IPs válidos
    const validIPv4s = [];
    const validIPv6s = [];
    
    ipList.forEach(ip => {
        if (!ip || typeof ip !== 'string') return;
        
        const cleaned = ip.trim().replace(/^::ffff:/, ''); // Remove prefixo IPv4-mapped
        
        if (cleaned.includes('.') && cleaned !== '127.0.0.1' && cleaned !== '0.0.0.0') {
            // É IPv4 e não é localhost/inválido
            validIPv4s.push(cleaned);
        } else if (cleaned.includes(':') && !cleaned.startsWith('fe80:') && cleaned !== '::1' && cleaned !== '::') {
            // É IPv6, não é link-local, não é localhost e não é inválido
            validIPv6s.push(cleaned);
        }
    });
    
    // Escolher o melhor IP de cada tipo
    if (validIPv4s.length > 0) {
        // Priorizar IPs da rede institucional (172.x.x.x), depois outros privados, depois públicos
        const institutionIPs = validIPv4s.filter(ip => ip.startsWith('172.'));
        const privateIPs = validIPv4s.filter(ip => ip.startsWith('192.168.') || ip.startsWith('10.'));
        const publicIPs = validIPv4s.filter(ip => !ip.startsWith('192.168.') && !ip.startsWith('10.') && !ip.startsWith('172.'));
        
        if (institutionIPs.length > 0) {
            ips.ipv4 = institutionIPs[0];
        } else if (privateIPs.length > 0) {
            ips.ipv4 = privateIPs[0];
        } else if (publicIPs.length > 0) {
            ips.ipv4 = publicIPs[0];
        } else {
            ips.ipv4 = validIPv4s[0];
        }
    }
    
    if (validIPv6s.length > 0) {
        // Priorizar IPs globais sobre unique local (fc00::/7)
        const globalIPs = validIPv6s.filter(ip => !ip.startsWith('fc') && !ip.startsWith('fd'));
        const uniqueLocalIPs = validIPv6s.filter(ip => ip.startsWith('fc') || ip.startsWith('fd'));
        
        if (globalIPs.length > 0) {
            ips.ipv6 = globalIPs[0];
        } else if (uniqueLocalIPs.length > 0) {
            ips.ipv6 = uniqueLocalIPs[0];
        } else {
            ips.ipv6 = validIPv6s[0];
        }
    }

    return ips;
}

module.exports = {
    getServerIPs,
    categorizeIPs
};