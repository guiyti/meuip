# UFABC Network Speed Test

<div align="center">
  <img src="https://nti.ufabc.edu.br/wp-content/themes/NTI-theme/images/logo2.png" alt="UFABC NTI Logo" width="200"/>
  
  **Sistema de Teste de Velocidade da Rede Interna da UFABC**
  
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](#licença)
  [![UFABC](https://img.shields.io/badge/UFABC-NTI-009639.svg)](https://nti.ufabc.edu.br/)
</div>

## 📋 Sobre o Projeto

Aplicação web desenvolvida para o **Núcleo de Tecnologia da Informação (NTI)** da **Universidade Federal do ABC (UFABC)** para diagnóstico e monitoramento da performance da rede interna.

### 🎯 Funcionalidades

- **✅ Detecção de IPs**: Identificação automática de IPv4 e IPv6 do cliente
- **🌐 Dual Stack**: Suporte completo para conectividade IPv4 e IPv6
- **🚀 Testes de Velocidade**: Download, Upload e Latência em tempo real
- **📊 Gráficos Dinâmicos**: Visualização dos resultados com Chart.js
- **🔒 Detecção de VPN**: Identifica conexões via VPN institucional
- **💾 Persistência**: Salva localização do usuário no localStorage
- **📱 Responsivo**: Interface adaptável para desktop, tablet e mobile

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
- **Método**: 10 requisições HTTP consecutivas para `/ping`
- **Medição**: Round Trip Time (RTT) em milissegundos
- **Resultado**: Média após remoção de outliers

## 🔧 Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Página principal |
| `/api/server-info` | GET | IPs do servidor |
| `/api/client-ips` | GET | IPs do cliente |
| `/api/dual-stack-test` | GET | Teste de conectividade |
| `/ping` | GET | Teste de latência |
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

- **🌐 Rede Interna**: Gradiente verde, ícone de rede
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
    testRounds: 5,              // 5 rodadas por teste
    pingCount: 10               // 10 pings para latência
};
```

## 🎯 Detecção de VPN

A aplicação identifica conexões via VPN institucional através do range de IPs:

```javascript
if (ipv4 && ipv4.includes('172.17.4.')) {
    // Conexão via VPN institucional
}
```

## 📊 Precisão dos Testes

- **Dados Reais**: Transferência de 10MB total por sessão completa
- **Sem Mocks**: Todos os testes usam transferência real de dados
- **Algoritmos Padrão**: Seguem metodologias da indústria
- **Múltiplas Medições**: 5 testes por métrica para precisão estatística

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

**Núcleo de Tecnologia da Informação - UFABC**
- Website: [nti.ufabc.edu.br](https://nti.ufabc.edu.br/)
- Email: nti@ufabc.edu.br

---

<div align="center">
  Desenvolvido com ❤️ pelo NTI da UFABC
</div> 