#!/bin/bash

# =============================================================================
# Script de Validação de Velocidade UFABCnet - v1.1
# =============================================================================
# Este script replica os testes da interface web usando curl e ping
# Para comparação direta com os resultados da interface web
# 
# Uso: ./validate_speed.sh [number_of_tests]
# Exemplo: ./validate_speed.sh 12
# 
# NOTA: Este script se auto-deleta após a execução para garantir
# que sempre seja baixada a versão mais atualizada
# =============================================================================

# Configurações
TESTS=${1:-12}  # Número de testes (padrão: 12, como na interface)
HOST="meuip.ufabc.int.br"
TIMEOUT=15
UPLOAD_TIMEOUT=30  # Timeout maior para upload
SCRIPT_NAME="$0"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para cleanup e auto-delete
cleanup() {
    echo
    echo -e "${YELLOW}🧹 Limpando arquivo temporário...${NC}"
    if [ -f "$SCRIPT_NAME" ] && [ "$SCRIPT_NAME" != "/bin/bash" ]; then
        rm -f "$SCRIPT_NAME"
        echo -e "${GREEN}✅ Script removido com sucesso${NC}"
        echo -e "${BLUE}💡 Para executar novamente, baixe a versão atualizada:${NC}"
        echo -e "   ${YELLOW}curl -O http://meuip.ufabc.int.br/validate_speed.sh && chmod +x validate_speed.sh && ./validate_speed.sh${NC}"
    fi
}

# Configurar trap para cleanup
trap cleanup EXIT

# Função para calcular estatísticas de velocidade (sem casas decimais)
calculate_speed_stats() {
    local values=("$@")
    local count=${#values[@]}
    
    if [ $count -eq 0 ]; then
        echo "0"
        return
    fi
    
    # Ordenar valores
    IFS=$'\n' sorted=($(sort -n <<<"${values[*]}"))
    unset IFS
    
    # Calcular mediana
    local middle=$((count / 2))
    if [ $((count % 2)) -eq 0 ]; then
        # Número par de elementos
        local median=$(echo "scale=0; (${sorted[$((middle-1))]} + ${sorted[$middle]}) / 2" | bc)
    else
        # Número ímpar de elementos
        local median=${sorted[$middle]}
    fi
    
    echo $median
}

# Função para calcular estatísticas de latência (com 3 casas decimais)
calculate_latency_stats() {
    local values=("$@")
    local count=${#values[@]}
    
    if [ $count -eq 0 ]; then
        echo "0.000"
        return
    fi
    
    # Ordenar valores
    IFS=$'\n' sorted=($(sort -n <<<"${values[*]}"))
    unset IFS
    
    # Calcular mediana
    local middle=$((count / 2))
    if [ $((count % 2)) -eq 0 ]; then
        # Número par de elementos
        local median=$(echo "scale=3; (${sorted[$((middle-1))]} + ${sorted[$middle]}) / 2" | bc)
    else
        # Número ímpar de elementos
        local median=${sorted[$middle]}
    fi
    
    echo $median
}

# Banner
echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}  Validação de Velocidade UFABCnet - v1.1${NC}"
echo -e "${BLUE}===============================================${NC}"
echo -e "Host: ${YELLOW}$HOST${NC}"
echo -e "Testes por métrica: ${YELLOW}$TESTS${NC}"
echo -e "Timeout: ${YELLOW}${TIMEOUT}s / ${UPLOAD_TIMEOUT}s${NC}"
echo

# Verificar dependências
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ Erro: curl não encontrado${NC}"
    exit 1
fi

if ! command -v bc &> /dev/null; then
    echo -e "${RED}❌ Erro: bc não encontrado${NC}"
    exit 1
fi

# =============================================================================
# TESTE DE DOWNLOAD
# =============================================================================
echo -e "${GREEN}🔽 Iniciando teste de Download...${NC}"
download_speeds=()
download_failures=0

for i in $(seq 1 $TESTS); do
    echo -ne "   Teste $i/$TESTS... "
    
    # Executar curl com timeout (compatível com macOS)
    result=$(curl -s -o /dev/null -w "%{speed_download}" --max-time $TIMEOUT "http://$HOST/testfile?cb=$(date +%s%N)" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ -n "$result" ] && [ "$(echo "$result > 0" | bc)" -eq 1 ]; then
        # Converter para Mbps (sem casas decimais)
        speed_mbps=$(echo "scale=0; $result * 8 / 1000000" | bc)
        download_speeds+=($speed_mbps)
        echo -e "${GREEN}✓ $speed_mbps Mbps${NC}"
    else
        download_failures=$((download_failures + 1))
        echo -e "${RED}✗ Falhou${NC}"
    fi
    
    # Pequeno delay para evitar sobrecarga
    sleep 0.8
done

# Calcular estatísticas de download
if [ ${#download_speeds[@]} -gt 0 ]; then
    download_median=$(calculate_speed_stats "${download_speeds[@]}")
    download_success_rate="${#download_speeds[@]}/$TESTS"
    echo -e "   ${BLUE}📊 Download - Mediana: ${download_median} Mbps (Taxa de sucesso: $download_success_rate)${NC}"
else
    download_median="0"
    echo -e "   ${RED}❌ Download - Todos os testes falharam${NC}"
fi

echo

# =============================================================================
# TESTE DE UPLOAD
# =============================================================================
echo -e "${GREEN}🔼 Iniciando teste de Upload...${NC}"
upload_speeds=()
upload_failures=0

for i in $(seq 1 $TESTS); do
    echo -ne "   Teste $i/$TESTS... "
    
    # Executar upload com timeout maior (compatível com macOS)
    result=$(dd if=/dev/zero bs=1024 count=1024 2>/dev/null | curl -s -X POST --data-binary @- -w '%{speed_upload}' --max-time $UPLOAD_TIMEOUT "http://$HOST/upload?cb=$(date +%s%N)" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ -n "$result" ] && [ "$(echo "$result > 0" | bc)" -eq 1 ]; then
        # Converter para Mbps (sem casas decimais)
        speed_mbps=$(echo "scale=0; $result * 8 / 1000000" | bc)
        upload_speeds+=($speed_mbps)
        echo -e "${GREEN}✓ $speed_mbps Mbps${NC}"
    else
        upload_failures=$((upload_failures + 1))
        echo -e "${RED}✗ Falhou${NC}"
    fi
    
    # Delay maior para upload para evitar sobrecarga
    sleep 1.5
done

# Calcular estatísticas de upload
if [ ${#upload_speeds[@]} -gt 0 ]; then
    upload_median=$(calculate_speed_stats "${upload_speeds[@]}")
    upload_success_rate="${#upload_speeds[@]}/$TESTS"
    echo -e "   ${BLUE}📊 Upload - Mediana: ${upload_median} Mbps (Taxa de sucesso: $upload_success_rate)${NC}"
else
    upload_median="0"
    echo -e "   ${RED}❌ Upload - Todos os testes falharam${NC}"
fi

echo

# =============================================================================
# TESTE DE LATÊNCIA
# =============================================================================
echo -e "${GREEN}🏓 Iniciando teste de Latência...${NC}"

# Executar ping com parâmetros compatíveis com macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    ping_result=$(ping -c $TESTS -t 5 $HOST 2>/dev/null)
else
    # Linux
    ping_result=$(ping -c $TESTS -W 2 $HOST 2>/dev/null)
fi

ping_exit_code=$?

if [ $ping_exit_code -eq 0 ]; then
    # Extrair tempos de ping - regex mais robusta
    ping_times=$(echo "$ping_result" | grep -o 'time=[0-9]*\.[0-9]*' | cut -d'=' -f2)
    
    if [ -n "$ping_times" ]; then
        # Converter para array
        ping_array=($ping_times)
        
        # Verificar se temos dados válidos
        if [ ${#ping_array[@]} -gt 0 ]; then
            latency_median=$(calculate_latency_stats "${ping_array[@]}")
            ping_success_rate="${#ping_array[@]}/$TESTS"
            echo -e "   ${BLUE}📊 Latência - Mediana: ${latency_median} ms (Taxa de sucesso: $ping_success_rate)${NC}"
        else
            latency_median="0.000"
            echo -e "   ${RED}❌ Latência - Array de tempos vazio${NC}"
        fi
    else
        latency_median="0.000"
        echo -e "   ${RED}❌ Latência - Não foi possível extrair tempos${NC}"
        echo -e "   ${YELLOW}🔍 Debug: Saída do ping:${NC}"
        echo "$ping_result" | head -3
    fi
else
    latency_median="0.000"
    echo -e "   ${RED}❌ Latência - Ping falhou (código: $ping_exit_code)${NC}"
fi

echo

# =============================================================================
# RELATÓRIO FINAL
# =============================================================================
echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}              RELATÓRIO FINAL${NC}"
echo -e "${BLUE}===============================================${NC}"
echo -e "📥 ${YELLOW}Download:${NC}  $download_median Mbps"
echo -e "📤 ${YELLOW}Upload:${NC}    $upload_median Mbps"
echo -e "🏓 ${YELLOW}Latência:${NC}  $latency_median ms"
echo
echo -e "${YELLOW}💡 Para comparar com a interface web:${NC}"
echo -e "   1. Execute este script múltiplas vezes"
echo -e "   2. Compare as medianas obtidas"
echo -e "   3. Diferenças de ±5-15% são normais"
echo -e "   4. A interface web usa retry + análise estatística"
echo

# Cleanup automático será executado pelo trap EXIT
