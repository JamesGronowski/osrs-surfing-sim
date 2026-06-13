import { OsrsClient } from './OsrsClient.js';
import { applyFixedLayoutCss } from './ui/applyFixedLayoutCss.js';
import { injectOsrsAssetUrls } from './ui/injectOsrsAssetUrls.js';

injectOsrsAssetUrls();
applyFixedLayoutCss();
initDemoNoticeDismiss();

OsrsClient.mount().catch((error) => {
  console.error(error);
});

function initDemoNoticeDismiss(): void {
  const main = document.getElementById('demo-notice-main');
  const close = document.getElementById('demo-notice-close');
  if (!main || !close) return;

  close.addEventListener('click', () => {
    main.classList.add('hidden');
  });
}
