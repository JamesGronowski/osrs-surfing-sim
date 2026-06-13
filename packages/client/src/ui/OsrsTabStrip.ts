import { bindUiPress } from './bindUiPress.js';
import { OSRS_ASSETS } from './osrsAssets.js';

/** Top-row control panel tabs (combat slot shows sailing options while on board). */
export type ControlPanelTabId = 'combat' | 'stats';

const TOP_TABS = [
  { id: 'combat' as const, icon: OSRS_ASSETS.tabs.combat, label: 'Sailing Options' },
  { id: 'stats' as const, icon: OSRS_ASSETS.tabs.stats, label: 'Skills' },
  { icon: OSRS_ASSETS.tabs.quests, label: 'Quest List' },
  { icon: OSRS_ASSETS.tabs.inventory, label: 'Inventory' },
  { icon: OSRS_ASSETS.tabs.equipment, label: 'Worn Equipment' },
  { icon: OSRS_ASSETS.tabs.prayer, label: 'Prayer' },
  { icon: OSRS_ASSETS.tabs.magic, label: 'Magic' },
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
  private topRoot: HTMLElement;
  private bottomRoot: HTMLElement;
  private activeTab: ControlPanelTabId = 'combat';
  private onTabChange: (tab: ControlPanelTabId) => void;

  constructor(
    topRoot: HTMLElement,
    bottomRoot: HTMLElement,
    onTabChange: (tab: ControlPanelTabId) => void,
  ) {
    this.topRoot = topRoot;
    this.bottomRoot = bottomRoot;
    this.onTabChange = onTabChange;
    this.render();
  }

  setActiveTab(tab: ControlPanelTabId): void {
    this.activeTab = tab;
    this.syncActiveState();
  }

  private render(): void {
    this.topRoot.className = 'osrs-tab-strip osrs-tab-strip-top';
    this.bottomRoot.className = 'osrs-tab-strip osrs-tab-strip-bottom';

    this.topRoot.innerHTML = `<div class="osrs-tab-strip-inner"></div>`;
    this.bottomRoot.innerHTML = `<div class="osrs-tab-strip-inner"></div>`;

    const topInner = this.topRoot.querySelector('.osrs-tab-strip-inner');
    const bottomInner = this.bottomRoot.querySelector('.osrs-tab-strip-inner');
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
      bindUiPress(btn, () => {
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
        <img src="${tab.icon}" alt="${tab.label}" />
      </button>
    `;
  }

  private syncActiveState(): void {
    this.topRoot.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === this.activeTab);
    });
  }
}
