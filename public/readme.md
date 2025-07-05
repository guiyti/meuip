# Frontend - UFABCnet Speed Test

## 📁 Arquivos Frontend

### `index.html`
- **Interface principal** da aplicação
- **Bootstrap 5.3** para layout responsivo
- **Chart.js** para gráficos em tempo real
- **Font Awesome** para ícones
- **CSS customizado** com variáveis CSS
- **JavaScript modular** com ES6 imports

### `testfile`
- **Arquivo binário** de exatamente **1MB** (1.048.576 bytes)
- **Gerado automaticamente** pelo servidor na primeira execução
- **Usado para testes** de download de velocidade real
- **Não deve ser editado** ou removido

## 🎨 Tecnologias Frontend

- **HTML5** semântico
- **CSS3** com Grid e Flexbox
- **JavaScript ES6+** modular
- **Bootstrap 5.3** para responsividade
- **Chart.js** para visualização de dados
- **Font Awesome 6.4** para ícones
- **Google Fonts** (Inter) para tipografia

## 📱 Design Responsivo

### Breakpoints
- **Desktop**: > 1024px - Layout de 4 colunas
- **Tablet**: 768px - 1024px - Layout vertical
- **Mobile**: < 768px - Layout compacto com gráficos maiores

### Estados da Interface
1. **Inicial**: Barra centralizada
2. **Teste**: Barra no topo + cards de resultados
3. **Completo**: Resultados finais exibidos

## 🔧 Configurações CSS

### Variáveis CSS
```css
:root {
    --primary-green: rgb(5, 103, 46);     /* Verde UFABC */
    --secondary-green: rgb(0, 66, 13);    /* Verde escuro */
    --highlight-yellow: rgb(255, 210, 0); /* Amarelo destaque */
    --white: rgb(255, 255, 255);          /* Branco */
    --light-gray: #f7f7f7;                /* Cinza claro */
    --medium-gray: #e9ecef;               /* Cinza médio */
    --dark-gray: #495057;                 /* Cinza escuro */
}
```

### Animações
- **Transições suaves**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Hover effects**: Elevação e sombras
- **Loading states**: Spinners e shimmer effects

## 📊 Gráficos (Chart.js)

### Configuração
```javascript
const miniChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        line: { tension: 0.4, borderWidth: 2 },
        point: { radius: 2, hoverRadius: 4 }
    },
    plugins: {
        tooltip: {
            displayColors: false,
            callbacks: {
                title: function() { return ''; },
                label: function(context) {
                    const value = context.parsed.y;
                    const borderColor = context.dataset.borderColor;
                    if (borderColor === 'rgb(255,210,0)') {
                        return `${value.toFixed(3)} ms`;
                    }
                    return `${value.toFixed(3)} Mbps`;
                }
            }
        }
    }
};
```

### Tipos de Gráfico
- **Download**: Linha verde com preenchimento
- **Upload**: Linha verde escura com preenchimento  
- **Latência**: Linha amarela com preenchimento

### Tooltips Melhorados
- **Sem índices**: Removido título do tooltip
- **Com unidades**: Valores mostram "ms" ou "Mbps"
- **Precisão**: 3 casas decimais em todos os valores

## 🏓 Sistema de Ping Individual

### Implementação JavaScript
```javascript
async function runLatencyTest() {
    const dataPoints = 12;
    const intervalMs = 500;
    const latencyData = [];
    
    for (let i = 0; i < dataPoints; i++) {
        const result = await latencyTest();
        if (result && result.success) {
            latencyData.push(result.latency);
            console.log(`✅ Ping ${i + 1}: ${result.latency.toFixed(3)}ms`);
        } else {
            latencyData.push(null);
        }
        
        updateMiniChart(latencyChart, labels, latencyData);
        if (i < dataPoints - 1) {
            await new Promise(res => setTimeout(res, intervalMs));
        }
    }
}
```

### Características
- **12 pings individuais** em tempo real
- **Intervalo de 500ms** entre pings
- **Atualização imediata** do gráfico
- **Precisão de 3 casas** decimais
- **Fallback HTTP** se ping ICMP falhar

## 🚀 Performance

### Otimizações
- **CDN** para bibliotecas externas
- **Lazy loading** de gráficos
- **Debounce** em animações
- **Minimal reflows** durante atualizações

### Metrics
- **First Paint**: < 1s
- **Interactive**: < 2s
- **Bundle size**: ~30KB (sem dependências)

## 🎯 Precisão Numérica

### Implementação
```javascript
// Todos os valores exibidos com 3 casas decimais
document.getElementById('latency-result').textContent = `${avgLatency.toFixed(3)} ms`;
document.getElementById('download-result').textContent = `${avgSpeed.toFixed(3)} Mbps`;
document.getElementById('upload-result').textContent = `${avgSpeed.toFixed(3)} Mbps`;
```

### Características
- **Latência**: `0.194 ms` (3 casas decimais)
- **Velocidade**: `25.450 Mbps` (3 casas decimais)
- **Consistência**: Todos os valores seguem o mesmo padrão
- **Tooltips**: Mantêm a mesma precisão

## 📁 Estrutura de Arquivos

```
public/
├── index.html          # Interface principal (40KB)
├── testfile            # Arquivo de teste (1MB)
├── package.json        # Configurações do frontend
└── readme.md           # Esta documentação
```

## 📝 Changelog Frontend

### v2.1.0 (Janeiro 2025)
- ✅ **Função `runLatencyTest()`**: 12 pings individuais em tempo real
- ✅ **Tooltips melhorados**: Valores com unidades, sem índices
- ✅ **Precisão 3 casas**: Todos os valores `.toFixed(3)`
- ✅ **Gráfico progressivo**: Atualização imediata após cada ping
- ✅ **Logs detalhados**: Console mostra cada ping individual

### v2.0.0 (Janeiro 2025)
- ✅ **Ping Real ICMP**: Latência autêntica via `/api/ping-real`
- ✅ **Gráficos 12 pontos**: Análise mais detalhada
- ✅ **Interface robusta**: Tratamento de erros aprimorado
- ✅ **Detecção VPN**: Localização automática
