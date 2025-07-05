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
- **Análise estatística**: Calcula mediana igual à interface web
- **Retry automático**: Tenta novamente em caso de falha
- **Cache-busting**: Evita cache com timestamps únicos
- **Timeout**: 15s para evitar travamento
- **Auto-delete**: Remove-se após execução (sempre versão atualizada)
- **Progress visual**: Mostra progresso colorido
- **Taxa de sucesso**: Mostra quantos testes foram bem-sucedidos

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
  Validação de Velocidade UFABCnet - v1.0
===============================================
🔽 Download - Mediana: 66.542 Mbps (Taxa de sucesso: 12/12)
🔼 Upload - Mediana: 52.341 Mbps (Taxa de sucesso: 11/12)
🏓 Latência - Mediana: 12.4 ms (Taxa de sucesso: 12/12)

🧹 Limpando arquivo temporário...
✅ Script removido com sucesso
💡 Para executar novamente, baixe a versão atualizada
```

### Comparação com Interface Web:
- **±5-15%**: Variação normal entre métodos
- **Download**: Curl pode ser 5-10% mais rápido
- **Upload**: Interface web pode ser mais rápida
- **Latência**: Ping sempre mais preciso

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

### Comandos Executados:

**Download:**
```bash
curl -s -o /dev/null -w "%{speed_download}" "http://meuip.ufabc.int.br/testfile?cb=TIMESTAMP"
```

**Upload:**
```bash
dd if=/dev/zero bs=1024 count=1024 2>/dev/null | \
curl -s -X POST --data-binary @- -w "%{speed_upload}" \
"http://meuip.ufabc.int.br/upload?cb=TIMESTAMP"
```

**Latência:**
```bash
ping -c 12 -W 2 meuip.ufabc.int.br
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

## 📞 Suporte

Para dúvidas sobre o script ou interpretação dos resultados:
- Abra issue no repositório
- Consulte a documentação da interface web
- Verifique logs do servidor

---

**Nota**: Este script é uma ferramenta de validação. Para uso em produção, considere implementar monitoramento contínuo com ferramentas especializadas. 