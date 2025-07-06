# =============================================================================
# Script de Validação de Velocidade UFABCnet - Windows PowerShell
# Versão: 1.3
# Autor: Sistema UFABCnet
# Descrição: Validação profissional de velocidade usando curl e ping no Windows
# =============================================================================

param(
    [Parameter(Position=0)]
    [int]$Tests = 12  # Número de testes (padrão: 12)
)

# Configurações
$HOST_URL = "__HOST__"
$TIMEOUT = 15           # Timeout para download (segundos)
$UPLOAD_TIMEOUT = 30    # Timeout para upload (segundos)
$SCRIPT_VERSION = "1.3"

# Função para auto-delete
function Remove-ScriptFile {
    if (Test-Path $MyInvocation.ScriptName) {
        Write-Host "🧹 Limpando arquivo temporário..." -ForegroundColor Yellow
        try {
            Remove-Item $MyInvocation.ScriptName -Force
            Write-Host "✅ Script removido com sucesso" -ForegroundColor Green
            Write-Host "💡 Para executar novamente, baixe a versão atualizada:" -ForegroundColor Blue
            Write-Host "   curl -O http://__HOST__/validate_speed.ps1 && powershell -ExecutionPolicy Bypass -File validate_speed.ps1" -ForegroundColor Yellow
        }
        catch {
            Write-Host "⚠️ Não foi possível remover o script automaticamente" -ForegroundColor Yellow
        }
    }
}

# Função para calcular mediana (velocidades sem casas decimais)
function Get-MedianSpeed {
    param([array]$Values)
    
    if ($Values.Count -eq 0) {
        return 0
    }
    
    $sorted = $Values | Sort-Object
    $count = $sorted.Count
    
    if ($count % 2 -eq 0) {
        $median = [Math]::Round(($sorted[$count/2 - 1] + $sorted[$count/2]) / 2, 0)
    } else {
        $median = [Math]::Round($sorted[$count/2], 0)
    }
    
    return $median
}

# Função para calcular média (latência com 3 casas decimais)
function Get-AverageLatency {
    param([array]$Values)
    
    if ($Values.Count -eq 0) {
        return 0.000
    }
    
    $sum = ($Values | Measure-Object -Sum).Sum
    $average = [Math]::Round($sum / $Values.Count, 3)
    
    return $average
}

# Validar parâmetros
if ($Tests -le 0) {
    Write-Host "❌ Erro: Número de testes deve ser um inteiro positivo" -ForegroundColor Red
    exit 1
}

# Verificar se curl está disponível
if (-not (Get-Command curl -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Erro: curl não encontrado. Instale curl ou use Windows 10/11" -ForegroundColor Red
    exit 1
}

# Header
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "  Validação de Velocidade UFABCnet - v$SCRIPT_VERSION" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "Host: $HOST_URL" -ForegroundColor Yellow
Write-Host "Testes por métrica: $Tests" -ForegroundColor Yellow
Write-Host "Timeout: ${TIMEOUT}s / ${UPLOAD_TIMEOUT}s" -ForegroundColor Yellow
Write-Host ""

# Função para teste de download com retry robusto
function Test-DownloadWithRetry {
    $maxRetries = 10
    $timeoutPerAttempt = 15
    
    for ($attempt = 1; $attempt -le $maxRetries; $attempt++) {
        try {
            # Cache busting com timestamp único
            $cacheBuster = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
            $url = "http://$HOST_URL/testfile?cb=$cacheBuster"
            
            # Executar curl com timeout
            $result = & curl -s -o nul -w "%{speed_download}" --max-time $timeoutPerAttempt $url 2>$null
            
            if ($LASTEXITCODE -eq 0 -and $result -and [double]$result -gt 0) {
                # Sucesso - converter para Mbps
                $speedMbps = [Math]::Round(([double]$result * 8) / 1000000, 0)
                return $speedMbps
            }
        }
        catch {
            # Continuar para próxima tentativa
        }
        
        # Aguardar antes da próxima tentativa
        if ($attempt -lt $maxRetries) {
            Start-Sleep -Milliseconds 300
        }
    }
    
    # Todas as tentativas falharam
    return $null
}

# =============================================================================
# TESTE DE DOWNLOAD
# =============================================================================
Write-Host "🔽 Iniciando teste de Download..." -ForegroundColor Green
$downloadSpeeds = @()
$downloadFailures = 0

for ($i = 1; $i -le $Tests; $i++) {
    Write-Host "   Teste $i/$Tests... " -NoNewline
    
    # Executar teste com retry
    $result = Test-DownloadWithRetry
    
    if ($result -ne $null) {
        $downloadSpeeds += $result
        Write-Host "✓ $result Mbps" -ForegroundColor Green
    }
    else {
        $downloadFailures++
        Write-Host "✗ Falhou (10 tentativas)" -ForegroundColor Red
    }
    
    # Delay para evitar sobrecarga
    Start-Sleep -Milliseconds 800
}

# Calcular estatísticas de download
if ($downloadSpeeds.Count -gt 0) {
    $downloadMedian = Get-MedianSpeed $downloadSpeeds
    $downloadSuccessRate = "$($downloadSpeeds.Count)/$Tests"
    Write-Host "   📊 Download - Mediana: $downloadMedian Mbps (Taxa de sucesso: $downloadSuccessRate)" -ForegroundColor Blue
} else {
    $downloadMedian = 0
    Write-Host "   ❌ Download - Todos os testes falharam" -ForegroundColor Red
}

Write-Host ""

# Função para teste de upload com retry robusto
function Test-UploadWithRetry {
    $maxRetries = 10
    $timeoutPerAttempt = 30
    
    for ($attempt = 1; $attempt -le $maxRetries; $attempt++) {
        try {
            # Cache busting com timestamp único
            $cacheBuster = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
            $url = "http://$HOST_URL/upload?cb=$cacheBuster"
            
            # Criar arquivo temporário com dados de 1MB
            $tempFile = [System.IO.Path]::GetTempFileName()
            $data = New-Object byte[] 1048576
            # Preencher com dados pseudo-aleatórios
            $random = New-Object System.Random
            $random.NextBytes($data)
            [System.IO.File]::WriteAllBytes($tempFile, $data)
            
            # Executar curl com timeout
            $result = & curl -s -X POST -T $tempFile -w "%{speed_upload}" --max-time $timeoutPerAttempt $url 2>$null
            
            # Limpar arquivo temporário
            Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
            
            if ($LASTEXITCODE -eq 0 -and $result -and [double]$result -gt 0) {
                # Sucesso - converter para Mbps
                $speedMbps = [Math]::Round(([double]$result * 8) / 1000000, 0)
                return $speedMbps
            }
        }
        catch {
            # Continuar para próxima tentativa
        }
        
        # Aguardar antes da próxima tentativa
        if ($attempt -lt $maxRetries) {
            Start-Sleep -Milliseconds 800
        }
    }
    
    # Todas as tentativas falharam
    return $null
}

# =============================================================================
# TESTE DE UPLOAD
# =============================================================================
Write-Host "🔼 Iniciando teste de Upload..." -ForegroundColor Green
$uploadSpeeds = @()
$uploadFailures = 0

for ($i = 1; $i -le $Tests; $i++) {
    Write-Host "   Teste $i/$Tests... " -NoNewline
    
    # Executar teste com retry
    $result = Test-UploadWithRetry
    
    if ($result -ne $null) {
        $uploadSpeeds += $result
        Write-Host "✓ $result Mbps" -ForegroundColor Green
    }
    else {
        $uploadFailures++
        Write-Host "✗ Falhou (10 tentativas)" -ForegroundColor Red
    }
    
    # Delay maior para upload
    Start-Sleep -Milliseconds 1500
}

# Calcular estatísticas de upload
if ($uploadSpeeds.Count -gt 0) {
    $uploadMedian = Get-MedianSpeed $uploadSpeeds
    $uploadSuccessRate = "$($uploadSpeeds.Count)/$Tests"
    Write-Host "   📊 Upload - Mediana: $uploadMedian Mbps (Taxa de sucesso: $uploadSuccessRate)" -ForegroundColor Blue
} else {
    $uploadMedian = 0
    Write-Host "   ❌ Upload - Todos os testes falharam" -ForegroundColor Red
}

Write-Host ""

# Função para teste de latência com retry robusto
function Test-LatencyWithRetry {
    $maxRetries = 10
    
    for ($attempt = 1; $attempt -le $maxRetries; $attempt++) {
        try {
            # Executar ping
            $pingResult = & ping -n $Tests $HOST_URL 2>$null
            
            if ($LASTEXITCODE -eq 0 -and $pingResult) {
                # Extrair tempos de ping
                $pingTimes = @()
                foreach ($line in $pingResult) {
                    if ($line -match "time=(\d+(?:\.\d+)?)ms" -or $line -match "tempo=(\d+(?:\.\d+)?)ms") {
                        $pingTimes += [double]$matches[1]
                    }
                }
                
                if ($pingTimes.Count -gt 0) {
                    # Calcular média dos tempos
                    $latencyAverage = Get-AverageLatency $pingTimes
                    return @{
                        Average = $latencyAverage
                        Count = $pingTimes.Count
                    }
                }
            }
        }
        catch {
            # Continuar para próxima tentativa
        }
        
        # Aguardar antes da próxima tentativa
        if ($attempt -lt $maxRetries) {
            Start-Sleep -Milliseconds 500
        }
    }
    
    # Todas as tentativas falharam
    return $null
}

# =============================================================================
# TESTE DE LATÊNCIA (PING COM RETRY ROBUSTO)
# =============================================================================
Write-Host "🏓 Iniciando teste de Latência..." -ForegroundColor Green
Write-Host "   Executando $Tests pings... " -NoNewline

# Executar teste de latência com retry
$latencyResult = Test-LatencyWithRetry

if ($latencyResult -ne $null) {
    $latencyAverage = $latencyResult.Average
    $pingCount = $latencyResult.Count
    
    Write-Host "✓ Concluído" -ForegroundColor Green
    Write-Host "   📊 Latência - Média: $latencyAverage ms ($pingCount/$Tests pings bem-sucedidos)" -ForegroundColor Blue
} else {
    $latencyAverage = 0.000
    Write-Host "✗ Falhou (10 tentativas)" -ForegroundColor Red
    Write-Host "   ❌ Latência - Todos os testes de ping falharam" -ForegroundColor Red
}

Write-Host ""

# =============================================================================
# RELATÓRIO FINAL
# =============================================================================
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "              RELATÓRIO FINAL" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "📥 Download:  $downloadMedian Mbps" -ForegroundColor Green
Write-Host "📤 Upload:    $uploadMedian Mbps" -ForegroundColor Green
Write-Host "🏓 Latência:  $latencyAverage ms" -ForegroundColor Green
Write-Host ""

# Dicas de uso
Write-Host "💡 Para comparar com a interface web:" -ForegroundColor Yellow
Write-Host "   1. Execute este script múltiplas vezes"
Write-Host "   2. Compare os resultados obtidos"
Write-Host "   3. Diferenças de ±5-15% são normais"
Write-Host "   4. Ambos usam 10 tentativas para máxima confiabilidade"
Write-Host ""

# Auto-delete
Remove-ScriptFile 