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

    // Dispatch para que outros módulos saibam
    window.dispatchEvent(new Event('configLoaded'));
  } catch (err) {
    console.error('Falha ao carregar config.json', err);
  }
})(); 