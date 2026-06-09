import {
  comboTierName,
  comboTierProgress,
  trickStanceName,
  type SimulationSnapshot,
  type SpeedState,
} from '@osrs-surfing/engine';

import { OSRS_ASSETS } from './osrsAssets.js';

import type { ComboTierName, TrickPrepareSlot } from '@osrs-surfing/engine';

const COMBO_TIER_BAR_COLORS: Record<ComboTierName, string> = {
  Bronze: 'linear-gradient(180deg, #e8a55c 0%, #8b5a2b 100%)',
  Iron: 'linear-gradient(180deg, #d8d8d8 0%, #6a6a6a 100%)',
  Steel: 'linear-gradient(180deg, #c8d4e0 0%, #6a7a8a 100%)',
  Mithril: 'linear-gradient(180deg, #7eb8e8 0%, #2a5080 100%)',
  Adamant: 'linear-gradient(180deg, #5ecf8a 0%, #1a5c38 100%)',
  Rune: 'linear-gradient(180deg, #7ec8f0 0%, #2868a8 100%)',
  Dragon: 'linear-gradient(180deg, #f0a050 0%, #8b2020 100%)',
};

type NavButtonId = 'toggle-full' | 'speed-down' | 'speed-up';

interface NavButtonConfig {
  icon: string;
  title: string;
  disabled: boolean;
  targetState: SpeedState | null;
}

export interface OsrsSailingPanelCallbacks {
  onSpeedState: (state: SpeedState) => void;
  onOpenShop: () => void;
  onPrepareTrick: (slot: TrickPrepareSlot) => void;
}

type PanelTab = 'movement' | 'rewards';

function navButtonConfig(state: SpeedState, button: NavButtonId): NavButtonConfig {
  const a = OSRS_ASSETS;
  switch (button) {
    case 'toggle-full':
      return {
        icon: state === 'riding' ? a.sailing.unsetSailsFast : a.sailing.setSails,
        title: state === 'riding' ? 'Stop' : 'Full speed ahead',
        disabled: false,
        targetState: state === 'riding' ? 'seated' : 'riding',
      };
    case 'speed-down':
      if (state === 'riding') {
        return {
          icon: a.chevron.down,
          title: 'Slow down',
          disabled: false,
          targetState: 'paddling',
        };
      }
      if (state === 'paddling') {
        return {
          icon: a.chevron.downStop,
          title: 'Stop',
          disabled: false,
          targetState: 'seated',
        };
      }
      if (state === 'seated') {
        return {
          icon: a.sailing.reverse,
          title: 'Reverse',
          disabled: false,
          targetState: 'reversing',
        };
      }
      return {
        icon: a.sailing.reverse,
        title: 'Reverse',
        disabled: true,
        targetState: null,
      };
    case 'speed-up':
      if (state === 'reversing') {
        return {
          icon: a.sailing.unsetSailsFast,
          title: 'Stop',
          disabled: false,
          targetState: 'seated',
        };
      }
      if (state === 'seated') {
        return {
          icon: a.chevron.up,
          title: 'Increase speed',
          disabled: false,
          targetState: 'paddling',
        };
      }
      if (state === 'paddling') {
        return {
          icon: a.chevron.upDouble,
          title: 'Full speed',
          disabled: false,
          targetState: 'riding',
        };
      }
      return {
        icon: a.chevron.up,
        title: 'Full speed',
        disabled: true,
        targetState: null,
      };
  }
}

export class OsrsSailingPanel {
  private root: HTMLElement;
  private callbacks: OsrsSailingPanelCallbacks;
  private activeTab: PanelTab = 'movement';
  private speedState: SpeedState = 'seated';

  constructor(root: HTMLElement, callbacks: OsrsSailingPanelCallbacks) {
    this.root = root;
    this.callbacks = callbacks;
    this.root.className = 'osrs-control-panel osrs-sailing-panel';
    this.root.innerHTML = this.renderShell();
    this.bindEvents();
  }

  update(snapshot: SimulationSnapshot): void {
    this.speedState = snapshot.surfboard.speedState;

    const steeringIcon = this.root.querySelector('#steering-icon') as HTMLImageElement;
    if (steeringIcon) {
      steeringIcon.src =
        snapshot.surfboard.speedState === 'seated'
          ? OSRS_ASSETS.sailing.notSteering
          : OSRS_ASSETS.sailing.steering;
    }

    this.updateNavButtons(snapshot.surfboard.speedState);

    const comboFill = this.root.querySelector('#combo-bar-fill') as HTMLElement;
    const comboLabel = this.root.querySelector('#combo-label');
    if (comboFill && comboLabel) {
      const combo = snapshot.progression.session.combo;
      const progress = comboTierProgress(combo);
      comboFill.style.width = combo > 0 ? `${(progress / 10) * 100}%` : '0%';
      comboFill.style.background = COMBO_TIER_BAR_COLORS[comboTierName(combo)];
      comboLabel.textContent = combo > 0 ? `${comboTierName(combo)} · ${combo}` : 'Combo';
    }

    this.syncTokenDisplay(snapshot.progression.coralTokens);

    this.root.querySelectorAll<HTMLButtonElement>('[data-prepare-slot]').forEach((btn) => {
      const slot = Number(btn.dataset.prepareSlot) as TrickPrepareSlot;
      const primed =
        snapshot.trickPrepare !== null &&
        snapshot.trickPrepare.slot === slot &&
        snapshot.trickPrepare.ticksSincePrepare > 0;
      btn.classList.toggle('primed', primed);
      const tickLabel = btn.querySelector('.prepare-ticks');
      if (tickLabel) {
        tickLabel.textContent =
          snapshot.trickPrepare?.slot === slot
            ? String(snapshot.trickPrepare.ticksSincePrepare)
            : '·';
      }
    });
  }

  setVisible(visible: boolean): void {
    this.root.classList.toggle('hidden', !visible);
  }

  private renderShell(): string {
    const a = OSRS_ASSETS;
    return `
      <div class="osrs-panel-chrome">
        <div class="osrs-panel-header">
          <img src="${a.sailing.viewSailingOptions}" alt="" class="osrs-panel-icon" width="20" height="20" />
          <span class="osrs-panel-title">Ura Ura Board</span>
          <img src="${a.sailing.raft}" alt="" class="osrs-boat-thumb" width="32" height="32" />
        </div>
        <div class="osrs-hp-bar">
          <div class="osrs-hp-bar-fill" id="combo-bar-fill"></div>
          <span class="osrs-hp-bar-label" id="combo-label">Combo</span>
        </div>
        <div class="osrs-tab-row">
          <button type="button" class="osrs-tab active" data-tab="movement" title="Facilities">
            <img src="${a.sailing.tabFacilities}" alt="Facilities" width="28" height="28" />
          </button>
          <button type="button" class="osrs-tab" data-tab="rewards" title="Crew">
            <img src="${a.sailing.tabCrew}" alt="Crew" width="28" height="28" />
          </button>
        </div>
        <div class="osrs-tab-body active" data-panel="movement">
          <p class="osrs-section-label">Navigation</p>
          <div class="osrs-nav-row">
            <button type="button" class="osrs-sprite-btn" data-nav-btn="toggle-full" title="Full speed ahead">
              <img src="${a.sailing.setSails}" alt="" />
            </button>
            <button type="button" class="osrs-sprite-btn" data-nav-btn="speed-down" title="Slow down">
              <img src="${a.chevron.down}" alt="" />
            </button>
            <button type="button" class="osrs-sprite-btn" data-nav-btn="speed-up" title="Increase speed">
              <img src="${a.chevron.up}" alt="" />
            </button>
            <img src="${a.sailing.steering}" alt="" class="osrs-steering-badge" id="steering-icon" />
          </div>
          <p class="osrs-section-label">Stance</p>
          <div class="osrs-trick-prepare-row">
            <button type="button" class="osrs-trick-prepare-btn" data-prepare-slot="0" title="Low stance (1) — rail, brain coral">
              <span class="prepare-label">${trickStanceName(0)}</span>
              <span class="prepare-ticks">·</span>
            </button>
            <button type="button" class="osrs-trick-prepare-btn" data-prepare-slot="1" title="Medium stance (2) — tunnel, wall ride">
              <span class="prepare-label">${trickStanceName(1)}</span>
              <span class="prepare-ticks">·</span>
            </button>
            <button type="button" class="osrs-trick-prepare-btn" data-prepare-slot="2" title="High stance (3) — jump">
              <span class="prepare-label">${trickStanceName(2)}</span>
              <span class="prepare-ticks">·</span>
            </button>
          </div>
          <p class="osrs-hint">Prime Low, Medium, or High 1–4 ticks before the matching feature. Too early or late = bail.</p>
        </div>
        <div class="osrs-tab-body" data-panel="rewards">
          <p class="osrs-section-label">Coral Token Shop</p>
          <div class="osrs-stat-line">Balance: <span id="coral-tokens-rewards">0</span></div>
          <button type="button" class="osrs-stone-btn" id="shop-btn">Open Reward Shop</button>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    for (const tab of this.root.querySelectorAll<HTMLButtonElement>('.osrs-tab')) {
      tab.addEventListener('click', () => {
        const id = tab.dataset.tab as PanelTab;
        this.activeTab = id;
        this.root.querySelectorAll('.osrs-tab').forEach((el) => el.classList.remove('active'));
        tab.classList.add('active');
        this.root.querySelectorAll('.osrs-tab-body').forEach((el) => {
          el.classList.toggle('active', (el as HTMLElement).dataset.panel === id);
        });
      });
    }

    this.root.querySelectorAll<HTMLButtonElement>('[data-nav-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) {
          return;
        }
        const id = btn.dataset.navBtn as NavButtonId;
        const config = navButtonConfig(this.speedState, id);
        if (config.targetState) {
          this.callbacks.onSpeedState(config.targetState);
        }
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>('[data-prepare-slot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slot = Number(btn.dataset.prepareSlot) as TrickPrepareSlot;
        this.callbacks.onPrepareTrick(slot);
      });
    });
    this.root.querySelector('#shop-btn')?.addEventListener('click', () => {
      this.callbacks.onOpenShop();
    });
  }

  private updateNavButtons(state: SpeedState): void {
    this.root.querySelectorAll<HTMLButtonElement>('[data-nav-btn]').forEach((btn) => {
      const id = btn.dataset.navBtn as NavButtonId;
      const config = navButtonConfig(state, id);
      btn.disabled = config.disabled;
      btn.title = config.title;
      const img = btn.querySelector('img');
      if (img) {
        img.src = config.icon;
        img.alt = config.title;
      }
      btn.classList.toggle('active', id === 'toggle-full' && state === 'riding');
    });
  }

  syncTokenDisplay(tokens: number): void {
    const rewards = this.root.querySelector('#coral-tokens-rewards');
    if (rewards) {
      rewards.textContent = String(tokens);
    }
  }
}
