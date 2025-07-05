// modules/network-tests.js

// Configurações robustas para produção - sempre aplicadas
const config = {
    testFileSize: 1024 * 1024, // 1MB
    testRounds: 1, // 1 rodada por ponto para velocidade (12 pontos = 12 testes)
    pingCount: 5, // 5 pings base * 3 = 15 medições para latência precisa
    timeoutMs: 45000, // 45 segundos timeout - robusto para produção
    retryAttempts: 3, // 3 tentativas para garantir robustez
    dataPoints: 12, // Pontos de dados para gráficos (mais realista)
    testIntervalMs: 500 // Intervalo entre pontos de dados
};

// Função utilitária para criar fetch com timeout e retry
async function fetchWithTimeoutAndRetry(url, options = {}, attempts = config.retryAttempts) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);
    
    const fetchOptions = {
        ...options,
        signal: controller.signal
    };
    
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            const response = await fetch(url, fetchOptions);
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (attempt === attempts) {
                throw error;
            }
            
            // Aguardar antes de tentar novamente
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            
            // Reiniciar o timeout para a nova tentativa
            const newController = new AbortController();
            const newTimeoutId = setTimeout(() => newController.abort(), config.timeoutMs);
            fetchOptions.signal = newController.signal;
        }
    }
}

// Obter informações do servidor
async function fetchServerInfo() {
    const response = await fetchWithTimeoutAndRetry('/api/server-info');
    const serverInfo = await response.json();
    
    console.log('⚙️ Configurações de produção aplicadas:', {
        timeoutMs: config.timeoutMs,
        retryAttempts: config.retryAttempts,
        testRounds: config.testRounds,
        pingCount: config.pingCount,
        dataPoints: config.dataPoints,
        testIntervalMs: config.testIntervalMs
    });
    
    return serverInfo;
}

// Teste de IP do cliente via IPv4 (forçando IPv4)
async function testClientIPv4(serverIPv4) {
    try {
        const ipv4Element = document.getElementById('ipv4');
        
        if (ipv4Element) {
            ipv4Element.textContent = 'Detectando...';
        }
        
        let detectedIPv4 = 'Não detectado';
        
        if (serverIPv4) {
            try {
                // Tentar fazer requisição forçando IPv4 usando o IP do servidor
                const response = await fetch(`http://${serverIPv4}:${window.location.port || 3000}/api/client-ips`);
                const data = await response.json();
                if (data.ipv4 && data.ipv4 !== 'Não detectado') {
                    detectedIPv4 = data.ipv4;
                }
            } catch (error) {
                console.log('Tentativa IPv4 específica falhou, tentando localhost:', error.message);
            }
        }
        
        // Se não conseguiu pelo IP específico, tentar localhost (fallback)
        if (detectedIPv4 === 'Não detectado') {
            try {
                const response = await fetch('/api/client-ips');
                const data = await response.json();
                if (data.ipv4 && data.ipv4 !== 'Não detectado') {
                    detectedIPv4 = data.ipv4;
                }
            } catch (error) {
                console.error('Erro na detecção IPv4:', error);
            }
        }
        
        if (ipv4Element) {
            ipv4Element.textContent = detectedIPv4;
        }
        
        return detectedIPv4;
    } catch (error) {
        const ipv4Element = document.getElementById('ipv4');
        
        if (ipv4Element) {
            ipv4Element.textContent = 'Erro ao detectar';
        }
        console.error('Erro IPv4:', error);
        return 'Erro ao detectar';
    }
}

// Teste de IP do cliente via IPv6 (forçando IPv6)
async function testClientIPv6(serverIPv6) {
    try {
        const ipv6Element = document.getElementById('ipv6');
        
        if (ipv6Element) {
            ipv6Element.textContent = 'Detectando...';
        }
        
        let detectedIPv6 = 'Não detectado';
        
        if (serverIPv6) {
            try {
                // Tentar fazer requisição forçando IPv6 usando o IP do servidor
                const response = await fetch(`http://[${serverIPv6}]:${window.location.port || 3000}/api/client-ips`);
                const data = await response.json();
                if (data.ipv6 && data.ipv6 !== 'Não detectado') {
                    detectedIPv6 = data.ipv6;
                }
            } catch (error) {
                console.log('Tentativa IPv6 específica falhou, tentando localhost:', error.message);
            }
        }
        
        // Se não conseguiu pelo IP específico, tentar localhost (fallback)
        if (detectedIPv6 === 'Não detectado') {
            try {
                const response = await fetch('/api/client-ips');
                const data = await response.json();
                if (data.ipv6 && data.ipv6 !== 'Não detectado') {
                    detectedIPv6 = data.ipv6;
                }
            } catch (error) {
                console.error('Erro na detecção IPv6:', error);
            }
        }
        
        if (ipv6Element) {
            ipv6Element.textContent = detectedIPv6;
        }
        
        return detectedIPv6;
    } catch (error) {
        const ipv6Element = document.getElementById('ipv6');
        
        if (ipv6Element) {
            ipv6Element.textContent = 'Erro ao detectar';
        }
        console.error('Erro IPv6:', error);
        return 'Erro ao detectar';
    }
}

// Teste de velocidade de download
async function testDownloadSpeed() {
    try {
        const elementId = arguments[0] || 'download';
        const element = document.getElementById(elementId);
        
        // Verificar se o elemento existe antes de tentar modificá-lo
        if (element) {
            element.textContent = 'Testando...';
        }
        
        let totalSpeed = 0;
        let successfulRounds = 0;
        
        for (let i = 0; i < config.testRounds; i++) {
            try {
                const start = Date.now();
                const response = await fetchWithTimeoutAndRetry('/testfile');
                
                if (!response.ok) {
                    console.warn(`Teste download falhou na rodada ${i + 1}: ${response.status}`);
                    continue;
                }
                
                await response.blob();
                const duration = (Date.now() - start) / 1000;
                
                // Verificar se a duração é válida
                if (duration > 0 && duration < config.timeoutMs / 1000) {
                    const bits = config.testFileSize * 8;
                    const speed = bits / duration / 1_000_000; // Mbps
                    totalSpeed += speed;
                    successfulRounds++;
                }
            } catch (error) {
                console.warn(`Erro na rodada ${i + 1} do teste download:`, error.message);
                continue;
            }
        }

        if (successfulRounds === 0) {
            if (element) {
                element.textContent = 'Sem conectividade';
                element.className = 'error';
            }
            return 0;
        }

        const avg = totalSpeed / successfulRounds;
        const formattedValue = avg.toFixed(3);
        
        // Atualizar o elemento se existir
        if (element) {
            element.textContent = formattedValue + ' Mbps';
            element.className = 'success';
        }
        
        return parseFloat(formattedValue);
    } catch (error) {
        const element = document.getElementById(arguments[0] || 'download');
        if (element) {
            element.textContent = 'Erro no teste';
            element.className = 'error';
        }
        console.error('Erro teste download:', error);
        return 0;
    }
}

// Teste de velocidade de upload
async function testUploadSpeed() {
    try {
        const elementId = arguments[0] || 'upload';
        const element = document.getElementById(elementId);
        if (element) element.textContent = 'Testando...';
        
        let totalSpeed = 0;
        let successfulRounds = 0;
        const data = new Uint8Array(config.testFileSize);

        for (let i = 0; i < config.testRounds; i++) {
            try {
                const start = Date.now();
                const response = await fetchWithTimeoutAndRetry('/upload', {
                    method: 'POST',
                    body: data
                });
                
                if (!response.ok) {
                    console.warn(`Teste upload falhou na rodada ${i + 1}: ${response.status}`);
                    continue;
                }
                
                const duration = (Date.now() - start) / 1000;
                
                // Verificar se a duração é válida
                if (duration > 0 && duration < config.timeoutMs / 1000) {
                    const bits = config.testFileSize * 8;
                    const speed = bits / duration / 1_000_000; // Mbps
                    totalSpeed += speed;
                    successfulRounds++;
                }
            } catch (error) {
                console.warn(`Erro na rodada ${i + 1} do teste upload:`, error.message);
                continue;
            }
        }

        if (successfulRounds === 0) {
            if (element) {
                element.textContent = 'Sem conectividade';
                element.className = 'error';
            }
            return 0;
        }

        const avg = totalSpeed / successfulRounds;
        const formattedValue = avg.toFixed(3);
        
        // Atualizar o elemento se existir
        if (element) {
            element.textContent = formattedValue + ' Mbps';
            element.className = 'success';
        }
        
        return parseFloat(formattedValue);
    } catch (error) {
        const element = document.getElementById(arguments[0] || 'upload');
        if (element) {
            element.textContent = 'Erro no teste';
            element.className = 'error';
        }
        console.error('Erro teste upload:', error);
        return 0;
    }
}

// Teste de latência usando PING REAL do servidor para o cliente (1 ping por vez)
async function latencyTest() {
    try {
        console.log('🏓 Executando ping real único (1 pacote)...');
        
        // Fazer UMA única chamada para ping com 1 pacote
        const response = await fetchWithTimeoutAndRetry('/api/ping-real?count=1');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.latencies && data.latencies.length > 0) {
            const latency = data.latencies[0]; // Primeiro (e único) valor
            
            console.log(`✅ Ping real executado: ${latency.toFixed(3)}ms`);
            
            return {
                latency: latency, // Valor único da latência
                success: true,
                isPingReal: true,
                clientIP: data.clientIP
            };
            
        } else {
            console.warn('⚠️ Ping real falhou:', data.error || 'Erro desconhecido');
            
            // Fallback para HTTP se ping real falhar
            console.log('🔄 Usando fallback HTTP...');
            
            try {
                const start = performance.now();
                const httpResponse = await fetch('/ping', { cache: 'no-cache' });
                if (httpResponse.ok) {
                    const httpLatency = performance.now() - start;
                    console.log(`📡 HTTP Fallback: ${httpLatency.toFixed(3)}ms`);
                    
                    return {
                        latency: httpLatency,
                        success: true,
                        isPingReal: false // Flag para identificar fallback HTTP
                    };
                } else {
                    throw new Error('HTTP response não ok');
                }
            } catch (httpError) {
                console.error('❌ HTTP Fallback também falhou:', httpError);
                return {
                    latency: null,
                    success: false,
                    error: 'Ping e HTTP indisponíveis',
                    isPingReal: false
                };
            }
        }
        
    } catch (error) {
        console.error('❌ Erro no teste de ping real:', error);
        return {
            latency: null,
            success: false,
            error: error.message,
            isPingReal: false
        };
    }
}

// Inicializar todos os testes
async function initTests() {
    try {
        // Obter os IPs do servidor
        const serverInfo = await fetchServerInfo();
        
        // Testar IPv4
        await testClientIPv4(serverInfo.ipv4);
        
        // Testar IPv6
        await testClientIPv6(serverInfo.ipv6);
        
        // Iniciar testes de velocidade
        await testDownloadSpeed();
        await testUploadSpeed();
    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
}

// Exportar as funções para uso em outros arquivos
export {
    fetchServerInfo,
    testClientIPv4,
    testClientIPv6,
    testDownloadSpeed,
    testUploadSpeed,
    latencyTest,
    initTests,
    config
};
