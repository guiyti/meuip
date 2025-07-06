# Network Speed Test (White-Label Edition)

<p align="center">
  <!-- Logo UFABC como exemplo inicial -->
  <img src="https://nti.ufabc.edu.br/wp-content/themes/NTI-theme/images/logo2.png" alt="Exemplo de Logo" width="180"/>
</p>

> A imagem acima é **apenas um exemplo** (logo da UFABC).  
> Ao alterar o `config.json` você pode trocar facilmente por qualquer logo.

<!-- Exemplo de screenshot (substitua por seu próprio arquivo se quiser) -->
<p align="center">
  <img src="docs/demo-screenshot.png" alt="Screenshot do teste em execução" width="700"/>
</p>

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg) ![License](https://img.shields.io/badge/License-MIT-blue.svg)

Aplicação web **genérica** para testes de download, upload e latência em tempo real. Todo o _branding_ (nome da empresa, logo, cores), endpoints de teste e textos dinâmicos são definidos em **um único arquivo JSON**.

> Precisa de um exemplo pronto? Consulte `public/config.ufabc.json` – configuração usada originalmente pela UFABC.

---

## ⚡ Quick Start

```bash
# 1. Clone o projeto
 git clone https://github.com/sua-org/network-speedtest-wl.git
 cd network-speedtest-wl

# 2. Instale as dependências
 npm install

# 3. (opcional) copie o modelo de configuração
 cp config.sample.json mycompany.json

# 4. Edite o JSON e inicie o servidor apontando para ele
 CONFIG_FILE=$(pwd)/mycompany.json npm start

# 5. Acesse em
 http://localhost:3000
```

---

## 🗂 Estrutura

```
project/
├─ public/
│  ├─ index.html           # Interface
│  ├─ config-loader.js     # Carrega /config.json e aplica branding
│  ├─ config.ufabc.json    # Exemplo UFABC (legado)
│  └─ assets/              # Logos, ícones adicionais
├─ modules/                # Lógica de testes de rede (front-end)
├─ server.js               # Servidor Express (back-end)
├─ config.sample.json      # Template de configuração
└─ README.md               # Este arquivo
```

---

## 🔧 Arquivo `config.json`

```json
{
  "company": {
    "name": "Minha Empresa LTDA",
    "logo": "/assets/logo.svg",
    "primaryColor": "#05672E",
    "secondaryColor": "#03441F",
    "accentColor": "#FFD200"
  },
  "network": {
    "testFileSizeKB": 1024,
    "downloadEndpoint": "/testfile",
    "uploadEndpoint": "/upload",
    "pingCount": 12,
    "dataPoints": 12,
    "vpnRanges": ["192.168.0.0/16", "10.0.0.0/8"]
  },
  "ui": {
    "showIPv4": true,
    "showIPv6": true,
    "defaultLanguage": "pt-BR",
    "appName": "UFABCnet",
    "pageTitle": "UFABCnet Speed Test",
    "vpnLabel": "Conectado via VPN",
    "directLabel": "Conectado diretamente"
  }
}
```

### Campos Importantes

| Campo | Descrição |
|-------|-----------|
| `company.*` | Define branding (cores, nome, logo). |
| `network.testFileSizeKB` | Tamanho do arquivo de teste (download). |
| `network.downloadEndpoint` | Rota para download. |
| `network.uploadEndpoint` | Rota para upload. |
| `network.pingCount` | Quantidade de pacotes ping (latência). |
| `network.dataPoints` | Quantidade de amostras em download & upload. |
| `network.vpnRanges` | Array de prefixos IPv4/IPv6 para identificar VPN. |
| `ui.*` | Preferências de exibição. |
| `ui.appName` | Nome do sistema mostrado na UI (ex.: "UFABCnet"). |
| `ui.pageTitle` | Título da aba/navegador. |
| `ui.vpnLabel` / `ui.directLabel` | Textos dos badges de conexão. |

---

## 🏗 Como Funciona o Carregamento da Configuração

1. `server.js` expõe `/config.json`.
2. `public/config-loader.js` busca o arquivo logo no _load_ da página.
3. O JSON é salvo em `window.appConfig` e um evento `configLoaded` é disparado.
4. Qualquer módulo (ex.: `network-tests.js`) ajusta suas constantes quando recebe o evento.

---

## 🧩 Adaptando para seu ambiente

1. **Editar cores & logo**: altere a seção `company`.
2. **Endpoints diferentes?**: mude `downloadEndpoint` e `uploadEndpoint`.
3. **Mais ou menos amostras**: ajuste `dataPoints` e `pingCount`.
4. **Idiomas/labels**: substitua textos no HTML ou mova-os para `config.json`.

---

## 📝 Documentação Adicional

* `README_UFABC.md` – Guia específico da UFABC, mantido como exemplo.
* `MELHORIAS.md` – Changelog e roadmap técnico.

---

## 📄 Licença

MIT © Colaboradores do projeto 