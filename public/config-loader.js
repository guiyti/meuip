/* config-loader.js - carrega configuração de branding genérica */

(async () => {
  try {
    const response = await fetch('/config.json', { cache: 'no-cache' });
    const cfg = await response.json();
    window.appConfig = cfg;

    // Aplicar cores via CSS variables
    const root = document.documentElement.style;
    if (cfg.company?.primaryColor)   root.setProperty('--primary',   cfg.company.primaryColor);
    if (cfg.company?.secondaryColor) root.setProperty('--secondary', cfg.company.secondaryColor);
    if (cfg.company?.accentColor)    root.setProperty('--accent',    cfg.company.accentColor);

    // Substituir nome e logo se existirem elementos
    const logoEl = document.querySelector('#companyLogo');
    if (logoEl && cfg.company?.logo) logoEl.src = cfg.company.logo;
    const nameEls = document.querySelectorAll('[data-company-name]');
    nameEls.forEach(el => el.textContent = cfg.company?.name || 'GenericNet');

    // Substituir appName
    const appNameEls = document.querySelectorAll('[data-app-name]');
    appNameEls.forEach(el => el.textContent = cfg.ui?.appName || 'NetworkTest');

    // Atualizar título da página se configurado
    if (cfg.ui?.pageTitle) {
        document.title = cfg.ui.pageTitle;
    }

    // Determinar host base
    const baseHost = cfg.network?.host || window.location.host;

    function replaceHostPlaceholders() {
        const all = document.querySelectorAll('*');
        all.forEach(el => {
            // Substituir em texto interno
            if (el.childNodes && el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                const txt = el.textContent;
                if (txt.includes('__HOST__')) {
                    el.textContent = txt.replaceAll('__HOST__', baseHost);
                }
            }
            // Substituir em atributos comuns
            Array.from(el.attributes || []).forEach(attr => {
                if (attr.value.includes('__HOST__')) {
                    el.setAttribute(attr.name, attr.value.replaceAll('__HOST__', baseHost));
                }
            });
        });
    }

    function replaceLegacyDomain() {
        const legacy = 'meuip.ufabc.int.br';
        if (legacy === baseHost) return;
        document.querySelectorAll('*').forEach(el=>{
            if(el.childNodes.length===1&&el.childNodes[0].nodeType===3){
                const t=el.textContent;
                if(t.includes(legacy)) el.textContent=t.replaceAll(legacy, baseHost);
            }
            Array.from(el.attributes||[]).forEach(attr=>{
                if(attr.value.includes(legacy)) el.setAttribute(attr.name,attr.value.replaceAll(legacy, baseHost));
            });
        });
    }

    // Executar após logo/textos para garantir substituição completa
    replaceHostPlaceholders();
    replaceLegacyDomain();

    // Dispatch para que outros módulos saibam
    window.dispatchEvent(new Event('configLoaded'));
  } catch (err) {
    console.error('Falha ao carregar config.json', err);
  }
})(); 