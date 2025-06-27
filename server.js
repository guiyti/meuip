const express = require('express');
const os = require('os');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ipUtils = require('./modules/ip-utils');

// Configuração do app
const app = express();
app.use(cors());
app.use(express.static('public'));
// Adicionando acesso à pasta modules para os módulos JavaScript
app.use('/modules', express.static('modules'));
// Removendo a validação do body para evitar erros no upload
app.use(express.raw({ type: '*/*', limit: '10mb' }));
app.set('trust proxy', true);

// Função para obter IPs do servidor
function getServerIPs() {
    return ipUtils.getServerIPs();
}

// Importação ou criação do arquivo de teste
function ensureTestFileExists() {
    const filePath = path.join(__dirname, 'public', 'testfile');
    const fileSize = 1024 * 1024; // 1MB
    
    if (!fs.existsSync(filePath)) {
        const buffer = Buffer.alloc(fileSize);
        fs.writeFileSync(filePath, buffer);
        console.log('Arquivo de teste criado com sucesso.');
    }
}

// Servir a página HTML estática
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API para obter informações do servidor
app.get('/api/server-info', (req, res) => {
    res.json(getServerIPs());
});

// API que retorna os IPs do cliente - versão melhorada para pilha dupla
app.get('/api/client-ips', (req, res) => {
    const xForwardedFor = req.headers['x-forwarded-for'] || '';
    const remoteAddress = req.socket.remoteAddress || '';
    const xRealIP = req.headers['x-real-ip'] || '';
    
    // Coletar todos os IPs possíveis
    const allPossibleIPs = [];
    
    // Adicionar IPs do x-forwarded-for (podem ser múltiplos)
    if (xForwardedFor) {
        const forwardedIPs = xForwardedFor.split(',').map(ip => ip.trim());
        allPossibleIPs.push(...forwardedIPs);
    }
    
    // Adicionar IP real
    if (xRealIP) {
        allPossibleIPs.push(xRealIP.trim());
    }
    
    // Adicionar IP da conexão direta
    if (remoteAddress) {
        allPossibleIPs.push(remoteAddress.trim());
    }
    
    // Para desenvolvimento local, incluir IPs do servidor
    const serverIPs = getServerIPs();
    const isLocalhost = allPossibleIPs.some(ip => 
        ip.includes('127.0.0.1') || 
        ip.includes('::1') || 
        ip === 'localhost'
    );
    
    if (isLocalhost) {
        console.log(`[DEBUG] Localhost detected, adding server IPs: IPv4=${serverIPs.ipv4}, IPv6=${serverIPs.ipv6}`);
        if (serverIPs.ipv4) allPossibleIPs.push(serverIPs.ipv4);
        if (serverIPs.ipv6) allPossibleIPs.push(serverIPs.ipv6);
    }
    
    // Categorizar IPs
    const ips = ipUtils.categorizeIPs(allPossibleIPs);
    
    // Log detalhado para debug
    console.log(`[${new Date().toISOString()}] Client IP Detection:`, {
        xForwardedFor,
        xRealIP,
        remoteAddress,
        allPossibleIPs,
        result: ips,
        isLocalhost
    });
    
    res.json(ips);
});

// API específica para testar conectividade de pilha dupla
app.get('/api/dual-stack-test', (req, res) => {
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const serverIPs = getServerIPs();
    
    // Informações detalhadas sobre a conexão
    const connectionInfo = {
        clientIP: clientIP,
        serverIPv4: serverIPs.ipv4,
        serverIPv6: serverIPs.ipv6,
        detectedStack: null,
        timestamp: new Date().toISOString()
    };
    
    // Determinar qual stack está sendo usado na conexão atual
    if (clientIP.includes(':') && !clientIP.includes('::ffff:')) {
        connectionInfo.detectedStack = 'IPv6';
    } else {
        connectionInfo.detectedStack = 'IPv4';
    }
    
    console.log(`[DUAL-STACK-TEST] Connection from ${clientIP} using ${connectionInfo.detectedStack}`);
    
    res.json(connectionInfo);
});

// Endpoint para teste de ping - ultra leve
app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

// Endpoint específico para latência - mínimo overhead possível
app.get('/latency', (req, res) => {
    // Resposta ultra-rápida sem processamento
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': '2',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    res.end('ok');
});

// Endpoint para teste de upload - simplificado para evitar erros
app.post('/upload', (req, res) => {
    // Sem validações, apenas confirma o recebimento
    res.status(200).send('Upload recebido');
});

// Endpoint para log de debug
app.post('/api/debug-log', express.json(), (req, res) => {
    const logData = req.body;
    const logMessage = `[${new Date().toISOString()}] ${JSON.stringify(logData)}\n`;
    
    fs.appendFile('debug.log', logMessage, (err) => {
        if (err) {
            console.error('Failed to write to debug.log:', err);
            return res.status(500).send('Failed to write log');
        }
        res.status(200).send('Log received');
    });
});

// Inicialização do servidor
ensureTestFileExists();

// Use a porta do ambiente ou 80 como padrão
const PORT = process.env.PORT || 80;
const server = app.listen(PORT, () => {
    const serverIPs = getServerIPs();
    console.log(`\n🚀 Servidor UFABC - Teste de Pilha Dupla rodando na porta ${PORT}:`);
    console.log(`📱 Local: http://localhost:${PORT}`);
    if (serverIPs.ipv4) {
        console.log(`🌐 IPv4: http://${serverIPs.ipv4}:${PORT}`);
    }
    if (serverIPs.ipv6) {
        console.log(`🌍 IPv6: http://[${serverIPs.ipv6}]:${PORT}`);
    }
    console.log(`\n💡 Para testar pilha dupla, acesse via qualquer dos endereços acima!`);
});
