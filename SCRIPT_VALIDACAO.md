# Script de Validação para Usuários Avançados

Este script bash permite que especialistas em rede validem e comparem os resultados da interface web UFABCnet usando comandos curl e ping nativos.

## 🚀 Início Rápido

```bash
# Baixar, executar e remover automaticamente
curl -O http://meuip.ufabc.int.br/validate_speed.sh && chmod +x validate_speed.sh && ./validate_speed.sh
```

**Nota**: O script se auto-deleta após a execução para garantir que sempre seja baixada a versão mais atualizada.

## 📊 Funcionalidades

- **Múltiplas medições**: 12 testes por padrão (configurável)
- **Sistema de retry robusto**: 10 tentativas por teste (todas as métricas)
- **Análise estatística**: Calcula mediana (download/upload) e média (latência)
- **Precisão formatada**: Download/Upload (inteiros), Latência (3 decimais)
- **Timeouts otimizados**: 15s (download) / 30s (upload) por tentativa
- **Compatibilidade**: Detecção automática macOS/Linux
- **Cache-busting**: Evita cache com timestamps únicos
- **Auto-delete**: Remove-se após execução (sempre versão atualizada)
- **Progress visual**: Mostra progresso colorido
- **Taxa de sucesso**: Mostra quantos testes foram bem-sucedidos
- **Teste de latência**: Ping com retry para máxima confiabilidade

## 🛠️ Uso Avançado

```bash
# Teste com mais medições para maior precisão
./validate_speed.sh 20

# Teste rápido (5 medições)
./validate_speed.sh 5

# Teste de stress (50 medições)
./validate_speed.sh 50
```

## 📈 Interpretação dos Resultados

### Exemplo de Saída:
```
===============================================
  Validação de Velocidade UFABCnet - v1.3
===============================================
🔽 Download - Mediana: 67 Mbps (Taxa de sucesso: 12/12)
🔼 Upload - Mediana: 52 Mbps (Taxa de sucesso: 11/12)
🏓 Latência - Média: 12.406 ms (12/12 pings bem-sucedidos)

🧹 Limpando arquivo temporário...
✅ Script removido com sucesso
💡 Para executar novamente, baixe a versão atualizada
```

### Comparação com Interface Web:
- **±5-15%**: Variação normal entre métodos
- **Download**: Curl pode ser 5-10% mais rápido
- **Upload**: Interface web pode ser mais rápida
- **Latência**: Ping sempre mais preciso
- **Robustez**: Ambos usam 10 tentativas para máxima confiabilidade

### Diferenças >20%:
Podem indicar:
- Problemas de rede
- Configuração incorreta
- Congestionamento temporário
- Problemas no servidor

## 🔧 Dependências

O script requer:
- `curl` (para testes HTTP)
- `ping` (para testes de latência)
- `bc` (para cálculos de precisão)
- `dd` (para geração de dados de teste)

### Instalação no Ubuntu/Debian:
```bash
sudo apt update
sudo apt install curl bc
```

### Instalação no macOS:
```bash
brew install bc
```

## 🎯 Casos de Uso

### 1. Validação de Resultados
Compare os resultados do script com a interface web para validar medições.

### 2. Testes Automatizados
Integre em scripts de monitoramento para verificar performance da rede.

### 3. Debugging de Rede
Use para isolar problemas entre cliente e servidor.

### 4. Benchmarking
Execute múltiplas vezes para criar baseline de performance.

## 🔬 Detalhes Técnicos

### Sistema de Retry Robusto
O script implementa retry para todas as métricas:
- **10 tentativas** por teste individual (download/upload/latência)
- **Timeout independente** por tentativa (15s/30s)
- **Delay progressivo** entre tentativas
- **Falha apenas** se todas as 10 tentativas falharem
- **Latência**: Ping com retry completo para máxima confiabilidade

### Comandos Executados:

**Download (com retry robusto):**
```bash
# Máximo 10 tentativas por teste
curl -s -o /dev/null -w "%{speed_download}" --max-time 15 \
"http://meuip.ufabc.int.br/testfile?cb=TIMESTAMP"
```

**Upload (com retry robusto):**
```bash
# Máximo 10 tentativas por teste
dd if=/dev/zero bs=1024 count=1024 2>/dev/null | \
curl -s -X POST --data-binary @- -w "%{speed_upload}" --max-time 30 \
"http://meuip.ufabc.int.br/upload?cb=TIMESTAMP"
```

**Latência (com retry robusto):**
```bash
# macOS - 12 pings, máximo 10 tentativas
ping -c 12 -t 5 meuip.ufabc.int.br

# Linux - 12 pings, máximo 10 tentativas
ping -c 12 -W 2 meuip.ufabc.int.br
```

## 📝 Debugging

Para debug adicional, execute:
```bash
bash -x validate_speed.sh
```

**Nota**: O script se auto-deleta após a execução para garantir que sempre seja baixada a versão mais atualizada.

## 🪟 Suporte para Windows

### Script PowerShell Nativo
```powershell
# Baixar e executar script PowerShell
curl -O http://meuip.ufabc.int.br/validate_speed.ps1
powershell -ExecutionPolicy Bypass -File validate_speed.ps1
```

### Comandos Individuais Windows
```cmd
# Download (CMD/PowerShell)
curl -s -o nul -w "%{speed_download}" http://meuip.ufabc.int.br/testfile

# Upload (CMD com arquivo temporário)
fsutil file createnew temp1mb.dat 1048576 && curl -X POST -T temp1mb.dat -w "%{speed_upload}" http://meuip.ufabc.int.br/upload && del temp1mb.dat

# Latência (CMD/PowerShell)
ping -n 12 meuip.ufabc.int.br
```

### Alternativas para Windows
- **WSL (Recomendado)**: `wsl bash validate_speed.sh`
- **Git Bash**: `bash validate_speed.sh`
- **PowerShell Core**: Script nativo `.ps1`

### Requisitos Windows
- **Windows 10/11**: curl disponível nativamente
- **Windows 7/8**: Instalar curl do [site oficial](https://curl.se/windows/)
- **PowerShell**: 5.1+ (pré-instalado no Windows 10/11)

## ⚠️ Limitações

- **IPv6**: Funciona apenas com IPv4
- **Firewall**: Pode ser bloqueado por firewalls corporativos
- **Proxy**: Não funciona através de proxies HTTP
- **Compatibilidade**: Testado em Linux, macOS e Windows 10/11

## 🆘 Solução de Problemas

### Erro "curl: command not found"
```bash
# Ubuntu/Debian
sudo apt install curl

# macOS
brew install curl
```

### Erro "bc: command not found"
```bash
# Ubuntu/Debian
sudo apt install bc

# macOS
brew install bc
```

### Timeout nos testes
- Verifique conectividade: `ping meuip.ufabc.int.br`
- Teste curl manual: `curl -I http://meuip.ufabc.int.br`
- Aumentar timeout no script

### Taxa de sucesso baixa
- Problemas de rede intermitentes
- Servidor sobrecarregado
- Firewall bloqueando conexões
- **Nota**: Com retry automático, testes falharam apenas se todas as 10 tentativas falharam

### Problemas específicos do Windows

#### Script PowerShell não executa
```powershell
# Habilitar execução de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Ou executar com bypass
powershell -ExecutionPolicy Bypass -File validate_speed.ps1
```

#### Comando curl não encontrado (Windows 7/8)
```cmd
# Verificar se curl está disponível
curl --version

# Se não estiver, baixar do site oficial
# https://curl.se/windows/
```

#### Permissões para criar arquivo temporário
```powershell
# Executar PowerShell como administrador
# Ou verificar permissões na pasta temp
$env:TEMP
```

#### Antivírus bloqueando script
- Adicionar exceção para o script
- Executar temporariamente sem antivírus
- Usar Windows Defender apenas

## 📞 Suporte

Para dúvidas sobre o script ou interpretação dos resultados:
- Abra issue no repositório
- Consulte a documentação da interface web
- Verifique logs do servidor

---

**Nota**: Este script é uma ferramenta de validação. Para uso em produção, considere implementar monitoramento contínuo com ferramentas especializadas. 