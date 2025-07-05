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

// Endpoint para ping real do servidor para o cliente
app.get('/api/ping-real', async (req, res) => {
    try {
        // Capturar o IP real do cliente
        let rawClientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                         req.headers['x-real-ip'] ||
                         req.connection.remoteAddress ||
                         req.socket.remoteAddress ||
                         (req.connection.socket ? req.connection.socket.remoteAddress : null);

        // Limpar IPv6-mapped IPv4 addresses (::ffff:192.168.1.1 -> 192.168.1.1)
        let clientIP = rawClientIP;
        if (clientIP && clientIP.startsWith('::ffff:')) {
            clientIP = clientIP.substring(7);
        }

        console.log(`🏓 IP capturado: ${rawClientIP} -> limpo: ${clientIP}`);

        // Validar se é um IP válido para ping
        if (!clientIP || 
            clientIP === '::1' || 
            clientIP === '127.0.0.1' || 
            clientIP === 'localhost' ||
            clientIP.includes('::')) {
            return res.json({
                error: 'IP local ou inválido detectado - ping não aplicável',
                rawIP: rawClientIP,
                cleanIP: clientIP
            });
        }

        // Validar formato IPv4 básico
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipv4Regex.test(clientIP)) {
            return res.json({
                error: 'Formato de IP não suportado para ping',
                rawIP: rawClientIP,
                cleanIP: clientIP
            });
        }

        // Executar ping real usando comando do sistema
        const { exec } = require('child_process');
        const pingCount = req.query.count || 1; // Permitir especificar quantidade de pings
        
        // Comando ping com quantidade especificada
        const pingCommand = `ping -c ${pingCount} -W 2 -i 0.5 ${clientIP}`;
        
        console.log(`🔧 Executando: ${pingCommand}`);
        
        exec(pingCommand, { timeout: 15000 }, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Erro no ping para ${clientIP}:`, error.message);
                console.error(`📋 stderr:`, stderr);
                return res.json({
                    error: `Falha no ping: ${error.message}`,
                    command: pingCommand,
                    stderr: stderr,
                    clientIP: clientIP
                });
            }

            try {
                console.log(`📋 Output do ping:\n${stdout}`);
                
                // Parse dos resultados do ping com múltiplos padrões
                const lines = stdout.split('\n');
                const pingTimes = [];
                
                // Padrão específico para capturar apenas tempos de ping individuais
                lines.forEach(line => {
                    // Capturar apenas linhas com resposta de ping individual
                    // Formato: "64 bytes from X.X.X.X: icmp_seq=N ttl=XX time=N.NN ms"
                    if (line.includes('bytes from') && line.includes('time=')) {
                        const timeMatch = line.match(/time=([0-9.]+)\s*ms/i);
                        if (timeMatch) {
                            const time = parseFloat(timeMatch[1]);
                            if (time > 0 && time < 10000) { // Sanity check (0-10s)
                                pingTimes.push(time);
                            }
                        }
                    }
                });

                console.log(`📊 Tempos extraídos: ${pingTimes.join(', ')}ms`);

                if (pingTimes.length === 0) {
                    return res.json({
                        error: 'Nenhum tempo de ping capturado - verifique formato',
                        clientIP: clientIP,
                        rawOutput: stdout,
                        command: pingCommand
                    });
                }

                // Calcular estatísticas
                const average = pingTimes.reduce((a, b) => a + b, 0) / pingTimes.length;
                const min = Math.min(...pingTimes);
                const max = Math.max(...pingTimes);
                const sorted = [...pingTimes].sort((a, b) => a - b);
                const median = sorted[Math.floor(sorted.length / 2)];

                console.log(`📊 Ping real para ${clientIP} - Média: ${average.toFixed(2)}ms, Min: ${min}ms, Max: ${max}ms`);

                res.json({
                    success: true,
                    clientIP: clientIP,
                    latencies: pingTimes,
                    statistics: {
                        average: average,
                        median: median,
                        min: min,
                        max: max,
                        count: pingTimes.length
                    }
                });

            } catch (parseError) {
                console.error(`❌ Erro no parse do ping:`, parseError);
                res.json({
                    error: `Erro no parse: ${parseError.message}`,
                    clientIP: clientIP,
                    rawOutput: stdout
                });
            }
        });

    } catch (error) {
        console.error('❌ Erro geral no ping real:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
});

// Endpoint para teste de upload via curl - recebe dados binários
app.post('/upload', (req, res) => {
    // Recebimento de dados para teste de upload via curl
    // Resposta vazia para não interferir com curl metrics
    res.status(200).end();
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

// Endpoint para teste de download via curl
app.get('/api/download-curl', async (req, res) => {
    try {
        const { exec } = require('child_process');
        const fileSize = req.query.size || 1024; // KB
        const testRounds = req.query.rounds || 1;
        
        console.log(`🔄 Teste download curl - ${fileSize}KB, ${testRounds} rodadas`);
        
        // Capturar o IP real do cliente para logs
        let clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                      req.headers['x-real-ip'] ||
                      req.connection.remoteAddress ||
                      req.socket.remoteAddress;
        
        if (clientIP && clientIP.startsWith('::ffff:')) {
            clientIP = clientIP.substring(7);
        }
        
        // Construir URL para download
        const protocol = req.protocol;
        const host = req.get('host');
        const downloadUrl = `${protocol}://${host}/testfile`;
        
        // Comando curl para download com medição de tempo
        const curlCommand = `curl -s -o /dev/null -w "%{time_total},%{size_download},%{speed_download}" "${downloadUrl}"`;
        
        console.log(`🔧 Executando: ${curlCommand}`);
        
        const results = [];
        let successfulRounds = 0;
        
        for (let i = 0; i < testRounds; i++) {
            await new Promise((resolve) => {
                exec(curlCommand, { timeout: 30000 }, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`❌ Erro curl download rodada ${i + 1}:`, error.message);
                        results.push(null);
                        resolve();
                        return;
                    }
                    
                    try {
                        const [timeTotal, sizeDownload, speedDownload] = stdout.trim().split(',');
                        const timeTotalSec = parseFloat(timeTotal);
                        const sizeBytes = parseFloat(sizeDownload);
                        const speedBytesPerSec = parseFloat(speedDownload);
                        
                        // Converter para Mbps
                        const speedMbps = (speedBytesPerSec * 8) / 1_000_000;
                        
                        if (speedMbps > 0 && timeTotalSec > 0) {
                            results.push({
                                time: timeTotalSec,
                                size: sizeBytes,
                                speed: speedMbps,
                                round: i + 1
                            });
                            successfulRounds++;
                            console.log(`✅ Curl download rodada ${i + 1}: ${speedMbps.toFixed(3)} Mbps (${timeTotalSec.toFixed(3)}s)`);
                        } else {
                            results.push(null);
                            console.warn(`⚠️ Curl download rodada ${i + 1}: valores inválidos`);
                        }
                    } catch (parseError) {
                        console.error(`❌ Erro parse curl rodada ${i + 1}:`, parseError);
                        results.push(null);
                    }
                    
                    resolve();
                });
            });
        }
        
        if (successfulRounds === 0) {
            return res.json({
                error: 'Nenhum teste curl de download foi bem-sucedido',
                command: curlCommand,
                clientIP: clientIP
            });
        }
        
        const validResults = results.filter(r => r !== null);
        const speeds = validResults.map(r => r.speed);
        const averageSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
        const minSpeed = Math.min(...speeds);
        const maxSpeed = Math.max(...speeds);
        
        console.log(`📊 Curl download para ${clientIP} - Média: ${averageSpeed.toFixed(3)} Mbps, Min: ${minSpeed.toFixed(3)} Mbps, Max: ${maxSpeed.toFixed(3)} Mbps`);
        
        res.json({
            success: true,
            method: 'curl',
            clientIP: clientIP,
            results: validResults,
            statistics: {
                average: averageSpeed,
                min: minSpeed,
                max: maxSpeed,
                count: successfulRounds,
                total: testRounds
            }
        });
        
    } catch (error) {
        console.error('❌ Erro geral no teste curl download:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
});

// Endpoint para teste de upload via curl
app.get('/api/upload-curl', async (req, res) => {
    try {
        const { exec } = require('child_process');
        const fileSize = req.query.size || 1024; // KB
        const testRounds = req.query.rounds || 1;
        
        console.log(`🔄 Teste upload curl - ${fileSize}KB, ${testRounds} rodadas`);
        
        // Capturar o IP real do cliente para logs
        let clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                      req.headers['x-real-ip'] ||
                      req.connection.remoteAddress ||
                      req.socket.remoteAddress;
        
        if (clientIP && clientIP.startsWith('::ffff:')) {
            clientIP = clientIP.substring(7);
        }
        
        // Construir URL para upload
        const protocol = req.protocol;
        const host = req.get('host');
        const uploadUrl = `${protocol}://${host}/upload`;
        
        // Comando curl para upload com medição de tempo
        // Usando dd para gerar dados do tamanho especificado
        const curlCommand = `dd if=/dev/zero bs=1024 count=${fileSize} 2>/dev/null | curl -s -X POST -H "Content-Type: application/octet-stream" --data-binary @- -w "%{time_total},%{size_upload},%{speed_upload}" "${uploadUrl}"`;
        
        console.log(`🔧 Executando: ${curlCommand}`);
        
        const results = [];
        let successfulRounds = 0;
        
        for (let i = 0; i < testRounds; i++) {
            await new Promise((resolve) => {
                exec(curlCommand, { timeout: 30000 }, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`❌ Erro curl upload rodada ${i + 1}:`, error.message);
                        results.push(null);
                        resolve();
                        return;
                    }
                    
                    try {
                        // Extrair métricas do curl (geralmente no final do output)
                        const output = stdout.trim();
                        let measurements;
                        
                        // Tentar diferentes padrões para extrair as métricas
                        if (output.includes(',')) {
                            // Se tem vírgulas, pegar a última parte com métricas
                            const parts = output.split(/[,\s]+/);
                            if (parts.length >= 3) {
                                // Pegar os últimos 3 valores numéricos
                                const numericParts = parts.filter(p => /^\d+(\.\d+)?$/.test(p)).slice(-3);
                                if (numericParts.length === 3) {
                                    measurements = numericParts.join(',');
                                }
                            }
                        }
                        
                        // Fallback: usar regex para extrair métricas do formato esperado
                        if (!measurements) {
                            const metricsMatch = output.match(/(\d+\.?\d*),(\d+),(\d+\.?\d*)$/);
                            if (metricsMatch) {
                                measurements = `${metricsMatch[1]},${metricsMatch[2]},${metricsMatch[3]}`;
                            }
                        }
                        
                        if (!measurements) {
                            throw new Error('Não foi possível extrair métricas do curl');
                        }
                        
                        const [timeTotal, sizeUpload, speedUpload] = measurements.split(',');
                        
                        const timeTotalSec = parseFloat(timeTotal);
                        const sizeBytes = parseFloat(sizeUpload);
                        const speedBytesPerSec = parseFloat(speedUpload);
                        
                        // Converter para Mbps
                        const speedMbps = (speedBytesPerSec * 8) / 1_000_000;
                        
                        if (speedMbps > 0 && timeTotalSec > 0) {
                            results.push({
                                time: timeTotalSec,
                                size: sizeBytes,
                                speed: speedMbps,
                                round: i + 1
                            });
                            successfulRounds++;
                            console.log(`✅ Curl upload rodada ${i + 1}: ${speedMbps.toFixed(3)} Mbps (${timeTotalSec.toFixed(3)}s)`);
                        } else {
                            results.push(null);
                            console.warn(`⚠️ Curl upload rodada ${i + 1}: valores inválidos`);
                        }
                    } catch (parseError) {
                        console.error(`❌ Erro parse curl rodada ${i + 1}:`, parseError);
                        results.push(null);
                    }
                    
                    resolve();
                });
            });
        }
        
        if (successfulRounds === 0) {
            return res.json({
                error: 'Nenhum teste curl de upload foi bem-sucedido',
                command: curlCommand,
                clientIP: clientIP
            });
        }
        
        const validResults = results.filter(r => r !== null);
        const speeds = validResults.map(r => r.speed);
        const averageSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
        const minSpeed = Math.min(...speeds);
        const maxSpeed = Math.max(...speeds);
        
        console.log(`📊 Curl upload para ${clientIP} - Média: ${averageSpeed.toFixed(3)} Mbps, Min: ${minSpeed.toFixed(3)} Mbps, Max: ${maxSpeed.toFixed(3)} Mbps`);
        
        res.json({
            success: true,
            method: 'curl',
            clientIP: clientIP,
            results: validResults,
            statistics: {
                average: averageSpeed,
                min: minSpeed,
                max: maxSpeed,
                count: successfulRounds,
                total: testRounds
            }
        });
        
    } catch (error) {
        console.error('❌ Erro geral no teste curl upload:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
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
