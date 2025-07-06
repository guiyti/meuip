// modules/network-tests.js

// Configurações robustas para produção - sempre aplicadas
const config = {
    testFileSize: 1024 * 1024, // 1MB
    testRounds: 1, // 1 rodada por ponto para velocidade (12 pontos = 12 testes)
    pingCount: 5, // 5 pings base * 3 = 15 medições para latência precisa
    timeoutMs: 45000, // 45 segundos timeout - robusto para produção
    retryAttempts: 10, // 10 tentativas para máxima robustez
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

// Teste de velocidade de download via HTTP direto (método robusto)
async function testDownloadSpeed() {
    const maxRetries = 10;
    const timeoutMs = 15000; // 15 segundos timeout
    const minValidSpeed = 0.1; // 0.1 Mbps mínimo considerado válido
    const maxValidSpeed = 10000; // 10 Gbps máximo considerado válido
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🔄 Download HTTP (tentativa ${attempt}/${maxRetries})...`);
            
            // Cache-busting com timestamp único
            const cacheBuster = Date.now() + Math.random().toString(36).substr(2, 9);
            const url = `/testfile?cb=${cacheBuster}`;
            
            // Controller para timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            
            const startTime = performance.now();
            const response = await fetch(url, {
                method: 'GET',
                cache: 'no-cache',
                signal: controller.signal,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Verificar se o conteúdo é válido
            const contentLength = response.headers.get('content-length');
            if (contentLength && parseInt(contentLength) < 1000) {
                throw new Error(`Arquivo muito pequeno: ${contentLength} bytes`);
            }
            
            // Ler conteúdo e medir
            const blob = await response.blob();
            const endTime = performance.now();
            
            // Validar medição
            const durationSeconds = (endTime - startTime) / 1000;
            const sizeBytes = blob.size;
            
            if (durationSeconds < 0.001) {
                throw new Error(`Duração muito pequena: ${durationSeconds}s`);
            }
            
            if (sizeBytes < 1000) {
                throw new Error(`Tamanho inválido: ${sizeBytes} bytes`);
            }
            
            // Calcular velocidade
            const speedMbps = (sizeBytes * 8) / (durationSeconds * 1_000_000);
            
            // Validar velocidade (detecção de outliers)
            if (speedMbps < minValidSpeed || speedMbps > maxValidSpeed) {
                throw new Error(`Velocidade fora do range válido: ${speedMbps.toFixed(3)} Mbps`);
            }
            
            const formattedValue = speedMbps.toFixed(3);
            console.log(`✅ Download HTTP: ${formattedValue} Mbps (${sizeBytes} bytes, ${durationSeconds.toFixed(3)}s, tentativa ${attempt})`);
            
            return parseFloat(formattedValue);
            
        } catch (error) {
            console.warn(`⚠️ Download tentativa ${attempt} falhou:`, error.message);
            
            if (attempt === maxRetries) {
                console.error('❌ Todas as tentativas de download falharam');
                return null; // Retorna null em vez de 0 para indicar falha
            }
            
            // Aguardar antes da próxima tentativa (backoff exponencial)
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
    }
    
    return null;
}

// Teste de velocidade de upload via HTTP direto (método robusto)
async function testUploadSpeed() {
    const maxRetries = 10;
    const timeoutMs = 20000; // 20 segundos timeout (upload é mais lento)
    const minValidSpeed = 0.1; // 0.1 Mbps mínimo considerado válido
    const maxValidSpeed = 5000; // 5 Gbps máximo considerado válido
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🔄 Upload HTTP (tentativa ${attempt}/${maxRetries})...`);
            
            // Criar dados de teste com pattern para evitar compressão
            const testData = new Uint8Array(1024 * 1024);
            // Preencher com dados pseudo-aleatórios para evitar compressão
            for (let i = 0; i < testData.length; i++) {
                testData[i] = (i * 7 + i % 256) & 0xFF;
            }
            
            // Cache-busting com timestamp único
            const cacheBuster = Date.now() + Math.random().toString(36).substr(2, 9);
            const url = `/upload?cb=${cacheBuster}`;
            
            // Controller para timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            
            const startTime = performance.now();
            const response = await fetch(url, {
                method: 'POST',
                body: testData,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Content-Length': testData.length.toString()
                }
            });
            const endTime = performance.now();
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Validar medição
            const durationSeconds = (endTime - startTime) / 1000;
            const sizeBytes = testData.length;
            
            if (durationSeconds < 0.001) {
                throw new Error(`Duração muito pequena: ${durationSeconds}s`);
            }
            
            if (sizeBytes < 1000) {
                throw new Error(`Tamanho inválido: ${sizeBytes} bytes`);
            }
            
            // Calcular velocidade
            const speedMbps = (sizeBytes * 8) / (durationSeconds * 1_000_000);
            
            // Validar velocidade (detecção de outliers)
            if (speedMbps < minValidSpeed || speedMbps > maxValidSpeed) {
                throw new Error(`Velocidade fora do range válido: ${speedMbps.toFixed(3)} Mbps`);
            }
            
            const formattedValue = speedMbps.toFixed(3);
            console.log(`✅ Upload HTTP: ${formattedValue} Mbps (${sizeBytes} bytes, ${durationSeconds.toFixed(3)}s, tentativa ${attempt})`);
            
            return parseFloat(formattedValue);
            
        } catch (error) {
            console.warn(`⚠️ Upload tentativa ${attempt} falhou:`, error.message);
            
            if (attempt === maxRetries) {
                console.error('❌ Todas as tentativas de upload falharam');
                return null; // Retorna null em vez de 0 para indicar falha
            }
            
            // Aguardar antes da próxima tentativa (backoff exponencial)
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
    }
    
    return null;
}

// Teste de latência usando PING REAL do servidor para o cliente (1 ping por vez)
async function latencyTest() {
    const maxRetries = 10;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        let timeoutId = null;
        try {
            console.log(`🏓 Executando ping real único (1 pacote, tentativa ${attempt}/${maxRetries})...`);
            
            // Fazer UMA única chamada para ping com 1 pacote (sem retry interno)
            const controller = new AbortController();
            timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
            
            const response = await fetch('/api/ping-real?count=1', {
                signal: controller.signal,
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.latencies && data.latencies.length > 0) {
                const latency = data.latencies[0]; // Primeiro (e único) valor
                
                console.log(`✅ Ping real executado: ${latency.toFixed(3)}ms (tentativa ${attempt})`);
                
                return {
                    latency: latency, // Valor único da latência
                    success: true,
                    isPingReal: true,
                    clientIP: data.clientIP
                };
                
            } else {
                throw new Error(data.error || 'Ping real falhou');
            }
            
        } catch (error) {
            // Limpar timeout se houver erro
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            console.warn(`⚠️ Ping tentativa ${attempt} falhou:`, error.message);
            
            if (attempt === maxRetries) {
                // Última tentativa - tentar fallback HTTP
                console.log('🔄 Usando fallback HTTP após todas as tentativas...');
                
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
                        error: 'Ping e HTTP indisponíveis após 10 tentativas',
                        isPingReal: false
                    };
                }
            }
            
            // Aguardar antes da próxima tentativa
            await new Promise(resolve => setTimeout(resolve, attempt * 500));
        }
    }
    
    return {
        latency: null,
        success: false,
        error: 'Todas as tentativas falharam',
        isPingReal: false
    };
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


