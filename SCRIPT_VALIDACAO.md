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
- **Sistema de retry**: 3 tentativas por teste (igual à interface web)
- **Análise estatística**: Calcula mediana igual à interface web
- **Precisão formatada**: Download/Upload (inteiros), Latência (3 decimais)
- **Timeouts otimizados**: 15s (download) / 30s (upload) por tentativa
- **Compatibilidade**: Detecção automática macOS/Linux
- **Cache-busting**: Evita cache com timestamps únicos
- **Auto-delete**: Remove-se após execução (sempre versão atualizada)
- **Progress visual**: Mostra progresso colorido
- **Taxa de sucesso**: Mostra quantos testes foram bem-sucedidos
- **Debug avançado**: Mostra detalhes em caso de falha

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
  Validação de Velocidade UFABCnet - v1.1
===============================================
🔽 Download - Mediana: 67 Mbps (Taxa de sucesso: 12/12)
🔼 Upload - Mediana: 52 Mbps (Taxa de sucesso: 11/12)
🏓 Latência - Mediana: 12.406 ms (Taxa de sucesso: 12/12)

🧹 Limpando arquivo temporário...
✅ Script removido com sucesso
💡 Para executar novamente, baixe a versão atualizada
```

### Comparação com Interface Web:
- **±5-15%**: Variação normal entre métodos
- **Download**: Curl pode ser 5-10% mais rápido
- **Upload**: Interface web pode ser mais rápida
- **Latência**: Ping sempre mais preciso
- **Robustez**: Mesma taxa de sucesso com retry automático

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

### Sistema de Retry
O script implementa o mesmo sistema de retry da interface web:
- **3 tentativas** por teste individual
- **Timeout independente** por tentativa
- **Delay progressivo** entre tentativas
- **Falha apenas** se todas as 3 tentativas falharem

### Comandos Executados:

**Download (com retry):**
```bash
# Máximo 3 tentativas por teste
curl -s -o /dev/null -w "%{speed_download}" --max-time 15 \
"http://meuip.ufabc.int.br/testfile?cb=TIMESTAMP"
```

**Upload (com retry):**
```bash
# Máximo 3 tentativas por teste
dd if=/dev/zero bs=1024 count=1024 2>/dev/null | \
curl -s -X POST --data-binary @- -w "%{speed_upload}" --max-time 30 \
"http://meuip.ufabc.int.br/upload?cb=TIMESTAMP"
```

**Latência (com retry):**
```bash
# macOS - 3 tentativas por teste
ping -c 4 -t 5 meuip.ufabc.int.br

# Linux - 3 tentativas por teste
ping -c 4 -W 2 meuip.ufabc.int.br
```

## 📝 Debugging

Para debug adicional, execute:
```bash
bash -x validate_speed.sh
```

**Nota**: O script se auto-deleta após a execução para garantir que sempre seja baixada a versão mais atualizada.

## ⚠️ Limitações

- **IPv6**: Funciona apenas com IPv4
- **Firewall**: Pode ser bloqueado por firewalls corporativos
- **Proxy**: Não funciona através de proxies HTTP
- **Windows**: Requer WSL ou Git Bash
- **Compatibilidade**: Testado em Linux e macOS

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
- **Nota**: Com retry automático, testes falharam apenas se todas as 3 tentativas falharam

## 📞 Suporte

Para dúvidas sobre o script ou interpretação dos resultados:
- Abra issue no repositório
- Consulte a documentação da interface web
- Verifique logs do servidor

---

**Nota**: Este script é uma ferramenta de validação. Para uso em produção, considere implementar monitoramento contínuo com ferramentas especializadas. 