// modules/network-tests.js

// Configurações
const config = {
    testFileSize: 1024 * 1024, // 1MB
    testRounds: 5,
    pingCount: 10 // Número de pings para teste de latência
};

// Obter informações do servidor
async function fetchServerInfo() {
    const response = await fetch('/api/server-info');
    return await response.json();
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
        for (let i = 0; i < config.testRounds; i++) {
            const start = Date.now();
            const response = await fetch('/testfile');
            
            if (!response.ok) {
                if (element) {
                    element.textContent = 'Arquivo de teste ausente';
                    element.className = 'error';
                }
                return 'Erro';
            }
            
            await response.blob();
            const duration = (Date.now() - start) / 1000;
            const bits = config.testFileSize * 8;
            totalSpeed += bits / duration / 1_000_000; // Mbps
        }

        const avg = totalSpeed / config.testRounds;
        const formattedValue = avg.toFixed(2);
        
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
        return 'Erro';
    }
}

// Teste de velocidade de upload
async function testUploadSpeed() {
    try {
        const elementId = arguments[0] || 'upload';
        const element = document.getElementById(elementId);
        if (element) element.textContent = 'Testando...';
        
        let totalSpeed = 0;
        const data = new Uint8Array(config.testFileSize);

        for (let i = 0; i < config.testRounds; i++) {
            const start = Date.now();
            const response = await fetch('/upload', {
                method: 'POST',
                body: data
            });
            
            if (!response.ok) {
                if (element) {
                    element.textContent = 'Erro no servidor';
                    element.className = 'error';
                }
                return 'Erro';
            }
            
            const duration = (Date.now() - start) / 1000;
            const bits = config.testFileSize * 8;
            totalSpeed += bits / duration / 1_000_000; // Mbps
        }

        const avg = totalSpeed / config.testRounds;
        const formattedValue = avg.toFixed(2);
        
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
        return 'Erro';
    }
}

// Teste de latência
async function latencyTest() {
    try {
        const PING_COUNT = config.pingCount;
        const results = [];
        
        for (let i = 0; i < PING_COUNT; i++) {
            const start = Date.now();
            await fetch('/ping');
            const duration = Date.now() - start;
            results.push(duration);
        }
        
        // Remover outliers (opcional)
        const sortedResults = [...results].sort((a, b) => a - b);
        const filteredResults = sortedResults.slice(1, sortedResults.length - 1);
        
        const average = filteredResults.reduce((sum, val) => sum + val, 0) / filteredResults.length;
        
        return {
            average,
            values: results
        };
    } catch (error) {
        console.error('Erro no teste de latência:', error);
        return {
            average: null,
            values: [],
            error: error.message
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
