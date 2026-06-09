import { OsrsClient } from './OsrsClient.js';
import { applyFixedLayoutCss } from './ui/applyFixedLayoutCss.js';
import { injectOsrsAssetUrls } from './ui/injectOsrsAssetUrls.js';

injectOsrsAssetUrls();
applyFixedLayoutCss();

OsrsClient.mount().catch((error) => {
  console.error(error);
});
