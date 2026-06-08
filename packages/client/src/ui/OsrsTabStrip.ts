import { OSRS_ASSETS } from './osrsAssets.js';

const TAB_ICONS = [
  { id: 'combat', icon: OSRS_ASSETS.tabs.combat, label: 'Combat' },
  { id: 'stats', icon: OSRS_ASSETS.tabs.stats, label: 'Stats' },
  { id: 'sailing', icon: OSRS_ASSETS.tabs.sailing, label: 'Sailing', active: true },
  { id: 'inventory', icon: OSRS_ASSETS.tabs.inventory, label: 'Inventory' },
  { id: 'prayer', icon: OSRS_ASSETS.tabs.prayer, label: 'Prayer' },
  { id: 'magic', icon: OSRS_ASSETS.tabs.magic, label: 'Magic' },
] as const;

export class OsrsTabStrip {
  constructor(root: HTMLElement) {
    root.innerHTML = `<div class="osrs-tab-strip-inner"></div>`;
    const inner = root.querySelector('.osrs-tab-strip-inner');
    if (!inner) {
      return;
    }
    inner.innerHTML = TAB_ICONS.map(
      (tab) => `
      <button type="button" class="osrs-game-tab ${tab.active ? 'active' : ''}" title="${tab.label}" disabled>
        <img src="${tab.icon}" alt="${tab.label}" width="33" height="36" />
      </button>
    `,
    ).join('');
  }
}
