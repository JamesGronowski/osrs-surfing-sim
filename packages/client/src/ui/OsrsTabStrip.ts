import { OSRS_ASSETS } from './osrsAssets.js';

/** Top-row control panel tabs (combat slot shows sailing options while on board). */
export type ControlPanelTabId = 'combat' | 'stats';

const TOP_TABS = [
  { id: 'combat' as const, icon: OSRS_ASSETS.tabs.combat, label: 'Sailing Options' },
  { id: 'stats' as const, icon: OSRS_ASSETS.tabs.stats, label: 'Skills' },
  { id: 'inventory', icon: OSRS_ASSETS.tabs.inventory, label: 'Inventory' },
  { id: 'prayer', icon: OSRS_ASSETS.tabs.prayer, label: 'Prayer' },
  { id: 'magic', icon: OSRS_ASSETS.tabs.magic, label: 'Magic' },
] as const;

const BOTTOM_TABS = [
  { icon: OSRS_ASSETS.tabs.friends, label: 'Friends List' },
  { icon: OSRS_ASSETS.tabs.ignores, label: 'Ignore List' },
  { icon: OSRS_ASSETS.tabs.clanChannel, label: 'Chat-channel' },
  { icon: OSRS_ASSETS.tabs.accountManagement, label: 'Account Management' },
  { icon: OSRS_ASSETS.tabs.logout, label: 'Logout' },
  { icon: OSRS_ASSETS.tabs.options, label: 'Settings' },
  { icon: OSRS_ASSETS.tabs.emotes, label: 'Emotes' },
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
    this.root.innerHTML = `
      <div class="osrs-tab-strip-row osrs-tab-strip-top">
        <div class="osrs-tab-strip-inner"></div>
      </div>
      <div class="osrs-tab-strip-row osrs-tab-strip-bottom">
        <div class="osrs-tab-strip-inner"></div>
      </div>
    `;

    const rows = this.root.querySelectorAll('.osrs-tab-strip-inner');
    const topInner = rows[0];
    const bottomInner = rows[1];
    if (!topInner || !bottomInner) {
      return;
    }

    topInner.innerHTML = TOP_TABS.map((tab) => this.tabButtonHtml(tab)).join('');
    bottomInner.innerHTML = BOTTOM_TABS.map((tab) => this.tabButtonHtml(tab, false)).join('');

    for (const btn of topInner.querySelectorAll<HTMLButtonElement>('[data-tab]')) {
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

  private tabButtonHtml(
    tab: { id?: string; icon: string; label: string },
    interactive = true,
  ): string {
    const isInteractive = interactive && (tab.id === 'combat' || tab.id === 'stats');
    const active = tab.id === this.activeTab;
    return `
      <button
        type="button"
        class="osrs-game-tab ${active ? 'active' : ''}"
        title="${tab.label}"
        ${tab.id ? `data-tab="${tab.id}"` : ''}
        ${isInteractive ? '' : 'disabled'}
      >
        <img src="${tab.icon}" alt="${tab.label}" width="33" height="36" />
      </button>
    `;
  }

  private syncActiveState(): void {
    this.root.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === this.activeTab);
    });
  }
}
