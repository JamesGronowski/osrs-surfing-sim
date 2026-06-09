import { OSRS_ASSETS } from './osrsAssets.js';

/** Top-row control panel tabs (combat slot shows sailing options while on board). */
export type ControlPanelTabId = 'combat' | 'stats';

const TAB_ICONS = [
  { id: 'combat' as const, icon: OSRS_ASSETS.tabs.combat, label: 'Sailing Options' },
  { id: 'stats' as const, icon: OSRS_ASSETS.tabs.stats, label: 'Skills' },
  { id: 'inventory', icon: OSRS_ASSETS.tabs.inventory, label: 'Inventory' },
  { id: 'prayer', icon: OSRS_ASSETS.tabs.prayer, label: 'Prayer' },
  { id: 'magic', icon: OSRS_ASSETS.tabs.magic, label: 'Magic' },
] as const;

export class OsrsTabStrip {
  private root: HTMLElement;
  private activeTab: ControlPanelTabId = 'combat';
  private onTabChange: (tab: ControlPanelTabId) => void;

  constructor(root: HTMLElement, onTabChange: (tab: ControlPanelTabId) => void) {
    this.root = root;
    this.onTabChange = onTabChange;
    this.render();
  }

  setActiveTab(tab: ControlPanelTabId): void {
    this.activeTab = tab;
    this.syncActiveState();
  }

  private render(): void {
    this.root.innerHTML = `<div class="osrs-tab-strip-inner"></div>`;
    const inner = this.root.querySelector('.osrs-tab-strip-inner');
    if (!inner) {
      return;
    }
    inner.innerHTML = TAB_ICONS.map((tab) => {
      const isInteractive = tab.id === 'combat' || tab.id === 'stats';
      const active = tab.id === this.activeTab;
      return `
      <button
        type="button"
        class="osrs-game-tab ${active ? 'active' : ''}"
        title="${tab.label}"
        data-tab="${tab.id}"
        ${isInteractive ? '' : 'disabled'}
      >
        <img src="${tab.icon}" alt="${tab.label}" width="33" height="36" />
      </button>
    `;
    }).join('');

    for (const btn of this.root.querySelectorAll<HTMLButtonElement>('[data-tab]')) {
      const id = btn.dataset.tab;
      if (id !== 'combat' && id !== 'stats') {
        continue;
      }
      btn.addEventListener('click', () => {
        this.activeTab = id;
        this.syncActiveState();
        this.onTabChange(id);
      });
    }
  }

  private syncActiveState(): void {
    this.root.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === this.activeTab);
    });
  }
}
