#!/bin/bash

# =============================================================================
# Script de Validação de Velocidade UFABCnet
# Versão: 1.3
# Autor: Sistema UFABCnet
# Descrição: Validação profissional de velocidade usando curl e ping
# =============================================================================

# Configurações
HOST="__HOST__"
TESTS=${1:-12}  # Número de testes (padrão: 12)
TIMEOUT=15      # Timeout para download
UPLOAD_TIMEOUT=30  # Timeout para upload

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para auto-delete
cleanup() {
    if [ -f "$0" ]; then
        echo -e "${YELLOW}🧹 Limpando arquivo temporário...${NC}"
        rm -f "$0"
        echo -e "${GREEN}✅ Script removido com sucesso${NC}"
        echo -e "${BLUE}💡 Para executar novamente, baixe a versão atualizada:${NC}"
        echo -e "   ${YELLOW}curl -O http://__HOST__/validate_speed.sh && chmod +x validate_speed.sh && ./validate_speed.sh${NC}"
    fi
}

# Configurar auto-delete no exit
trap cleanup EXIT

# Função para calcular estatísticas de velocidade (sem casas decimais)
calculate_speed_stats() {
    local values=("$@")
    local count=${#values[@]}
    
    # Ordenar valores
    IFS=$'\n' sorted=($(sort -n <<<"${values[*]}"))
    unset IFS
    
    # Calcular mediana
    local median
    if [ $((count % 2)) -eq 0 ]; then
        local mid1=${sorted[$((count/2 - 1))]}
        local mid2=${sorted[$((count/2))]}
        median=$(echo "scale=0; ($mid1 + $mid2) / 2" | bc)
    else
        median=${sorted[$((count/2))]}
    fi
    
    echo "$median"
}

# Validar parâmetros
if ! [[ "$TESTS" =~ ^[0-9]+$ ]] || [ "$TESTS" -le 0 ]; then
    echo -e "${RED}❌ Erro: Número de testes deve ser um inteiro positivo${NC}"
    exit 1
fi

# Header
echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}  Validação de Velocidade UFABCnet - v1.3${NC}"
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

# Função para teste com retry robusto
retry_download_test() {
    local max_retries=10
    local timeout_per_attempt=15
    
    for attempt in $(seq 1 $max_retries); do
        # Cache busting com timestamp único
        local cache_buster=$(date +%s%N)
        local result=$(curl -s -o /dev/null -w "%{speed_download}" --max-time $timeout_per_attempt "http://$HOST/testfile?cb=$cache_buster" 2>/dev/null)
        
        if [ $? -eq 0 ] && [ -n "$result" ] && [ "$(echo "$result > 0" | bc)" -eq 1 ]; then
            # Sucesso - converter para Mbps
            local speed_mbps=$(echo "scale=0; $result * 8 / 1000000" | bc)
            echo "$speed_mbps"
            return 0
        fi
        
        # Se não é a última tentativa, aguardar um pouco
        if [ $attempt -lt $max_retries ]; then
            sleep 0.3
        fi
    done
    
    # Todas as tentativas falharam
    echo "null"
    return 1
}

# =============================================================================
# TESTE DE DOWNLOAD
# =============================================================================
echo -e "${GREEN}🔽 Iniciando teste de Download...${NC}"
download_speeds=()
download_failures=0

for i in $(seq 1 $TESTS); do
    echo -ne "   Teste $i/$TESTS... "
    
    # Executar teste com retry
    result=$(retry_download_test)
    
    if [ "$result" != "null" ]; then
        download_speeds+=($result)
        echo -e "${GREEN}✓ $result Mbps${NC}"
    else
        download_failures=$((download_failures + 1))
        echo -e "${RED}✗ Falhou (10 tentativas)${NC}"
    fi
    
    # Delay para evitar sobrecarga
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

# Função para teste de upload com retry robusto
retry_upload_test() {
    local max_retries=10
    local timeout_per_attempt=30
    
    for attempt in $(seq 1 $max_retries); do
        # Cache busting com timestamp único
        local cache_buster=$(date +%s%N)
        local result=$(dd if=/dev/zero bs=1024 count=1024 2>/dev/null | curl -s -X POST --data-binary @- -w '%{speed_upload}' --max-time $timeout_per_attempt "http://$HOST/upload?cb=$cache_buster" 2>/dev/null)
        
        if [ $? -eq 0 ] && [ -n "$result" ] && [ "$(echo "$result > 0" | bc)" -eq 1 ]; then
            # Sucesso - converter para Mbps
            local speed_mbps=$(echo "scale=0; $result * 8 / 1000000" | bc)
            echo "$speed_mbps"
            return 0
        fi
        
        # Se não é a última tentativa, aguardar um pouco mais
        if [ $attempt -lt $max_retries ]; then
            sleep 0.8
        fi
    done
    
    # Todas as tentativas falharam
    echo "null"
    return 1
}

# =============================================================================
# TESTE DE UPLOAD
# =============================================================================
echo -e "${GREEN}🔼 Iniciando teste de Upload...${NC}"
upload_speeds=()
upload_failures=0

for i in $(seq 1 $TESTS); do
    echo -ne "   Teste $i/$TESTS... "
    
    # Executar teste com retry
    result=$(retry_upload_test)
    
    if [ "$result" != "null" ]; then
        upload_speeds+=($result)
        echo -e "${GREEN}✓ $result Mbps${NC}"
    else
        upload_failures=$((upload_failures + 1))
        echo -e "${RED}✗ Falhou (10 tentativas)${NC}"
    fi
    
    # Delay maior para upload
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

# Função para teste de latência com retry robusto
retry_latency_test() {
    local max_retries=10
    
    for attempt in $(seq 1 $max_retries); do
        # Executar ping com parâmetros específicos para cada OS
        local ping_result=""
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS: -c count, -t timeout
            ping_result=$(ping -c $TESTS -t 5 $HOST 2>/dev/null)
        else
            # Linux: -c count, -W timeout
            ping_result=$(ping -c $TESTS -W 2 $HOST 2>/dev/null)
        fi
        
        if [ $? -eq 0 ]; then
            # Extrair todos os tempos de ping
            local ping_times=$(echo "$ping_result" | grep -o 'time=[0-9]*\.[0-9]*' | cut -d'=' -f2)
            
            if [ -n "$ping_times" ]; then
                # Converter para array
                local latency_values=($ping_times)
                
                if [ ${#latency_values[@]} -gt 0 ]; then
                    # Calcular média dos tempos
                    local total_latency=0
                    for time in "${latency_values[@]}"; do
                        total_latency=$(echo "$total_latency + $time" | bc)
                    done
                    local latency_average=$(echo "scale=3; $total_latency / ${#latency_values[@]}" | bc)
                    
                    # Sucesso - retornar resultado
                    echo "${latency_average}:${#latency_values[@]}"
                    return 0
                fi
            fi
        fi
        
        # Se não é a última tentativa, aguardar um pouco
        if [ $attempt -lt $max_retries ]; then
            sleep 0.5
        fi
    done
    
    # Todas as tentativas falharam
    echo "null"
    return 1
}

# =============================================================================
# TESTE DE LATÊNCIA (PING COM RETRY ROBUSTO)
# =============================================================================
echo -e "${GREEN}🏓 Iniciando teste de Latência...${NC}"
echo -ne "   Executando $TESTS pings... "

# Executar teste de latência com retry
result=$(retry_latency_test)

if [ "$result" != "null" ]; then
    # Extrair resultado e contagem
    latency_average=$(echo "$result" | cut -d':' -f1)
    ping_count=$(echo "$result" | cut -d':' -f2)
    
    echo -e "${GREEN}✓ Concluído${NC}"
    echo -e "   ${BLUE}📊 Latência - Média: ${latency_average} ms (${ping_count}/$TESTS pings bem-sucedidos)${NC}"
else
    latency_average="0.000"
    echo -e "${RED}✗ Falhou (10 tentativas)${NC}"
    echo -e "   ${RED}❌ Latência - Todos os testes de ping falharam${NC}"
fi

echo

# =============================================================================
# RELATÓRIO FINAL
# =============================================================================
echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}              RELATÓRIO FINAL${NC}"
echo -e "${BLUE}===============================================${NC}"
echo -e "📥 Download:  ${GREEN}$download_median Mbps${NC}"
echo -e "📤 Upload:    ${GREEN}$upload_median Mbps${NC}"
echo -e "🏓 Latência:  ${GREEN}$latency_average ms${NC}"
echo

# Dicas de uso
echo -e "${YELLOW}💡 Para comparar com a interface web:${NC}"
echo -e "   1. Execute este script múltiplas vezes"
echo -e "   2. Compare os resultados obtidos"
echo -e "   3. Diferenças de ±5-15% são normais"
echo -e "   4. Ambos usam 10 tentativas para máxima confiabilidade"
echo 