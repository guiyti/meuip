# UFABC Network Speed Test

<div align="center">
  <img src="https://nti.ufabc.edu.br/wp-content/themes/NTI-theme/images/logo2.png" alt="UFABC NTI Logo" width="200"/>
  
  **Sistema de Teste de Velocidade da UFABCnet**
  
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](#licença)
  [![UFABC](https://img.shields.io/badge/UFABC-NTI-009639.svg)](https://nti.ufabc.edu.br/)
</div>

## 📋 Sobre o Projeto

Aplicação web desenvolvida para o **Núcleo de Tecnologia da Informação (NTI)** da **Universidade Federal do ABC (UFABC)** para diagnóstico e monitoramento da performance da UFABCnet.

### 🎯 Funcionalidades

- **✅ Detecção de IPs**: Identificação automática de IPv4 e IPv6 do cliente
- **🌐 Dual Stack**: Suporte completo para conectividade IPv4 e IPv6
- **🚀 Testes de Velocidade**: Download, Upload e Latência em tempo real
- **📊 Gráficos Dinâmicos**: Visualização dos resultados com Chart.js
- **🔒 Detecção de VPN**: Identifica conexões via VPN institucional
- **💾 Persistência**: Salva localização do usuário no localStorage
- **📱 Responsivo**: Interface adaptável para desktop, tablet e mobile
- **🎯 Precisão**: Todos os valores com 3 casas decimais
- **💬 Tooltips**: Valores com unidades (ms, Mbps) sem índices
- **⚡ Tempo Real**: Resultados aparecem imediatamente após cada teste

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **UI Framework**: Bootstrap 5.3
- **Gráficos**: Chart.js
- **Ícones**: Font Awesome 6.4
- **Fonts**: Google Fonts (Inter)

## 📁 Estrutura do Projeto

```
ufabc-network-speedtest/
├── 📁 modules/
│   ├── 📄 ip-utils.js          # Utilitários para detecção de IPs
│   ├── 📄 network-tests.js     # Módulos de teste de rede
│   └── 📄 speed-test.js        # Algoritmos de teste de velocidade
├── 📁 public/
│   ├── 📄 index.html           # Interface principal
│   ├── 📄 testfile             # Arquivo de 1MB para testes
│   └── 📄 readme.md            # Documentação do frontend
├── 📄 server.js                # Servidor Express principal
├── 📄 package.json             # Dependências e scripts
├── 📄 package-lock.json        # Lock das dependências
└── 📄 README.md                # Este arquivo
```

## 🚀 Instalação e Uso

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Rede local configurada (para testes reais)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/ufabc-network-speedtest.git
cd ufabc-network-speedtest
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute a aplicação

```bash
npm start
```

### 4. Acesse a aplicação

A aplicação estará disponível em:

- **Local**: `http://localhost:3000`
- **IPv4**: `http://[SEU_IPV4]:3000`
- **IPv6**: `http://[SEU_IPV6]:3000`

## 🧪 Como Funcionam os Testes

### 🔍 Detecção de IPs
1. **Teste de Stack Atual**: Verifica qual protocolo está sendo usado
2. **Teste IPv4 Específico**: Força conexão via IPv4 do servidor
3. **Teste IPv6 Específico**: Força conexão via IPv6 do servidor
4. **Fallback**: Usa endpoint padrão se os anteriores falharem

### 📡 Teste de Download
- **Método**: 5 downloads consecutivos de arquivo de 1MB
- **Cálculo**: `(bits transferidos / tempo em segundos) / 1.000.000 = Mbps`
- **Resultado**: Média aritmética dos 5 testes

### 📤 Teste de Upload
- **Método**: 5 uploads consecutivos de buffer de 1MB
- **Dados**: `Uint8Array` com 1.048.576 bytes
- **Cálculo**: Mesmo algoritmo do download

### ⚡ Teste de Latência
- **Método**: 12 comandos ping individuais (ICMP) para o IP do cliente
- **Execução**: Ping real do servidor → cliente (não HTTP)
- **Tempo Real**: Cada ping aparece imediatamente na interface
- **Fallback**: HTTP para `/ping` se ping ICMP falhar
- **Medição**: Round Trip Time (RTT) em milissegundos
- **Resultado**: Média aritmética com 3 casas decimais

## 🔧 Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Página principal |
| `/api/server-info` | GET | IPs do servidor |
| `/api/client-ips` | GET | IPs do cliente |
| `/api/dual-stack-test` | GET | Teste de conectividade |
| `/api/ping-real` | GET | Ping ICMP real do servidor para cliente |
| `/api/ping-real?count=N` | GET | Ping com N pacotes específicos |
| `/ping` | GET | Teste de latência HTTP (fallback) |
| `/upload` | POST | Recebimento de dados para teste |
| `/testfile` | GET | Download do arquivo de teste (1MB) |

## 🎨 Interface

### Estados da Aplicação

**🏠 Inicial**: 
- Barra de controle centralizada
- Detecção automática de IPs
- Campo de localização

**🚀 Teste em Execução**:
- Barra move para o topo
- Cards de resultados aparecem
- Gráficos atualizam em tempo real

### Badges de Conexão

- **🌐 UFABCnet**: Gradiente verde, ícone de rede
- **🛡️ VPN Institucional**: Gradiente dourado, ícone de escudo

## 🔧 Configuração

### Variáveis de Ambiente

```bash
PORT=3000  # Porta do servidor (opcional)
```

### Configurações de Teste

No arquivo `modules/network-tests.js`:

```javascript
const config = {
    testFileSize: 1024 * 1024,  // 1MB
    testRounds: 1,              // 1 rodada por ponto
    pingCount: 5,               // 5 pings base
    timeoutMs: 45000,           // 45 segundos timeout
    retryAttempts: 3,           // 3 tentativas para robustez
    dataPoints: 12,             // 12 pontos para gráficos
    testIntervalMs: 500         // 500ms entre testes individuais
};
```

## 🎯 Detecção de VPN

A aplicação identifica conexões via VPN institucional através do range de IPs:

```javascript
if (ipv4 && ipv4.includes('172.17.4.')) {
    // Conexão via VPN institucional
}
```

## 🏓 Sistema de Ping Individual

### Como Funciona
1. **Execução Individual**: 12 comandos `ping -c 1 -W 2 -i 0.5 [IP_CLIENTE]`
2. **Tempo Real**: Cada ping aparece imediatamente na interface
3. **Intervalo**: 500ms entre cada ping individual
4. **Duração Total**: ~6 segundos para 12 pings

### Exemplo de Execução
```bash
# Ping 1: 0.194ms → aparece no gráfico
# Ping 2: 0.201ms → aparece no gráfico
# Ping 3: 0.118ms → aparece no gráfico
# ... (continua até 12)
# Média final: 0.223ms (3 casas decimais)
```

### Fallback HTTP
Se o ping ICMP falhar, usa automaticamente requisições HTTP para `/ping` como backup.

### Testando via Console
```javascript
// Testar ping individual
await window.testPingReal();

// Testar pilha dupla
await window.testDualStack();
```

## 📊 Precisão dos Testes

- **Dados Reais**: Transferência de 12MB total por sessão completa
- **Sem Mocks**: Todos os testes usam transferência real de dados
- **Algoritmos Padrão**: Seguem metodologias da indústria
- **Múltiplas Medições**: 12 testes por métrica para precisão estatística
- **Precisão Numérica**: Todos os valores exibidos com 3 casas decimais
- **Ping Real**: Latência ICMP autêntica (não HTTP) quando possível
- **Tempo Real**: Resultados aparecem imediatamente após cada teste

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📝 Versionamento

### v2.1.0 (Janeiro 2025)
- ✅ **Ping Individual**: 12 comandos ping individuais em tempo real
- ✅ **Precisão 3 Casas**: Todos os valores com 3 casas decimais
- ✅ **Tooltips Melhorados**: Valores com unidades, sem índices
- ✅ **Endpoint Flexível**: `/api/ping-real?count=N`

### v2.0.0 (Janeiro 2025)
- ✅ **Ping Real ICMP**: Latência autêntica servidor → cliente
- ✅ **Robustez Aprimorada**: Configurações de produção sempre aplicadas
- ✅ **Detecção VPN**: Localização automática para IP institucional
- ✅ **Gráficos Melhorados**: 12 pontos de dados com atualização em tempo real

## 📞 Contato

**Núcleo de Tecnologia da Informação - UFABC**
- Website: [nti.ufabc.edu.br](https://nti.ufabc.edu.br/)
- Email: nti@ufabc.edu.br

---

<div align="center">
  Desenvolvido com ❤️ pelo NTI da UFABC
</div> 