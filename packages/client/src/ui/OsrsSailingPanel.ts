import {
  comboTierName,
  comboTierProgress,
  surfboardTierNameForUnlocks,
  TRICK_PREPARE_MAX_TICKS,
  TRICK_PREPARE_MIN_TICKS,
  TRICK_SPEED_BOOST_DURATION_TICKS,
  trickStanceName,
  type SimulationSnapshot,
  type SpeedState,
} from '@osrs-surfing/engine';

import { bindUiPress } from './bindUiPress.js';
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

/** OSRS hitpoints-bar green shown while no combo is active. */
const COMBO_BAR_IDLE_COLOR = 'linear-gradient(180deg, #06c206 0%, #048004 100%)';

const SURF_BOOST_BAR_COLOR = 'linear-gradient(180deg, #7ee8f0 0%, #1a7a8a 100%)';

type NavButtonId = 'toggle-full' | 'speed-down' | 'speed-up';

interface NavButtonConfig {
  icon: string;
  title: string;
  disabled: boolean;
  targetState: SpeedState | null;
}

interface StanceButtonConfig {
  slot: TrickPrepareSlot;
  icon: string;
  features: string;
  title: string;
}

const STANCE_BUTTONS: StanceButtonConfig[] = [
  {
    slot: 0,
    icon: OSRS_ASSETS.surf.stanceGrind,
    features: 'Rail · Coral',
    title: 'Grind stance (1) — slide rails and brain coral',
  },
  {
    slot: 1,
    icon: OSRS_ASSETS.surf.stanceTuck,
    features: 'Tunnel · Wall',
    title: 'Tuck stance (2) — duck tunnels and wall rides',
  },
  {
    slot: 2,
    icon: OSRS_ASSETS.surf.stanceAir,
    features: 'Jump',
    title: 'Air stance (3) — launch off jumps',
  },
];

export interface OsrsSailingPanelCallbacks {
  onSpeedState: (state: SpeedState) => void;
  onOpenShop: () => void;
  onPrepareTrick: (slot: TrickPrepareSlot) => void;
  onToggleTrueTile: (enabled: boolean) => void;
  onDismountBoard: () => void;
}

type PanelTab = 'board' | 'stats' | 'rewards';

function navButtonConfig(state: SpeedState, button: NavButtonId): NavButtonConfig {
  const a = OSRS_ASSETS;
  switch (button) {
    case 'toggle-full': {
      const moving = state !== 'seated';
      return {
        icon: moving ? a.surf.boardPlanted : a.surf.ride,
        title: moving ? 'Stop' : 'Full speed ahead',
        disabled: false,
        targetState: moving ? 'seated' : 'riding',
      };
    }
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
          icon: a.surf.reverse,
          title: 'Reverse',
          disabled: false,
          targetState: 'reversing',
        };
      }
      return {
        icon: a.surf.reverse,
        title: 'Reverse',
        disabled: true,
        targetState: null,
      };
    case 'speed-up':
      if (state === 'reversing') {
        return {
          icon: a.surf.boardPlanted,
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
  private activeTab: PanelTab = 'board';
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
    const steeringLabel = this.root.querySelector('#steering-label');
    const steering = snapshot.surfboard.speedState !== 'seated';
    if (steeringIcon) {
      steeringIcon.src = steering ? OSRS_ASSETS.sailing.steering : OSRS_ASSETS.sailing.notSteering;
    }
    if (steeringLabel) {
      steeringLabel.textContent = steering ? 'Steering' : 'Drifting';
    }

    this.updateNavButtons(snapshot.surfboard.speedState);

    const boardTierTitle = this.root.querySelector('#board-tier-title');
    if (boardTierTitle) {
      boardTierTitle.textContent = surfboardTierNameForUnlocks(snapshot.progression.unlocked);
    }

    const comboFill = this.root.querySelector('#combo-bar-fill') as HTMLElement;
    const comboLabel = this.root.querySelector('#combo-label');
    if (comboFill && comboLabel) {
      const combo = snapshot.progression.session.combo;
      const progress = comboTierProgress(combo);
      comboFill.style.width = combo > 0 ? `${(progress / 10) * 100}%` : '100%';
      comboFill.style.background =
        combo > 0 ? COMBO_TIER_BAR_COLORS[comboTierName(combo)] : COMBO_BAR_IDLE_COLOR;
      comboLabel.textContent = combo > 0 ? `${comboTierName(combo)} · ${combo}` : 'Ready';
    }

    const boostBar = this.root.querySelector('#surf-boost-bar') as HTMLElement;
    const boostFill = this.root.querySelector('#surf-boost-bar-fill') as HTMLElement;
    const boostLabel = this.root.querySelector('#surf-boost-label');
    const boostTicks = snapshot.trickSpeedBoostTicksRemaining;
    if (boostBar && boostFill && boostLabel) {
      const active = boostTicks > 0;
      boostBar.classList.toggle('hidden', !active);
      if (active) {
        boostFill.style.width = `${(boostTicks / TRICK_SPEED_BOOST_DURATION_TICKS) * 100}%`;
        boostFill.style.background = SURF_BOOST_BAR_COLOR;
        boostLabel.textContent = `Surf boost · ${boostTicks}`;
      }
    }

    const session = snapshot.progression.session;
    this.setText(
      '#stats-combo',
      session.combo > 0 ? `${session.combo} (${comboTierName(session.combo)})` : '0',
    );
    this.setText('#stats-max-combo', String(session.maxCombo));
    this.setText('#stats-tricks', String(session.tricksLanded));
    this.setText('#stats-tokens', String(snapshot.progression.coralTokens));
    this.syncTokenDisplay(snapshot.progression.coralTokens);

    const canPrime =
      snapshot.boardMounted &&
      snapshot.surfboard.speedState === 'riding' &&
      snapshot.trickAnimation === null;

    this.root.querySelectorAll<HTMLButtonElement>('[data-prepare-slot]').forEach((btn) => {
      const slot = Number(btn.dataset.prepareSlot) as TrickPrepareSlot;
      const primed =
        snapshot.trickPrepare !== null &&
        snapshot.trickPrepare.slot === slot &&
        snapshot.trickPrepare.ticksSincePrepare > 0;
      btn.disabled = !canPrime;
      btn.classList.toggle('primed', primed);
      const tickLabel = btn.querySelector('.osrs-stance-ticks');
      if (tickLabel) {
        tickLabel.textContent =
          snapshot.trickPrepare?.slot === slot
            ? String(snapshot.trickPrepare.ticksSincePrepare)
            : '';
      }
    });

    const stanceFootnote = this.root.querySelector('#stance-footnote');
    if (stanceFootnote) {
      stanceFootnote.textContent = canPrime
        ? `Prime ${TRICK_PREPARE_MIN_TICKS}–${TRICK_PREPARE_MAX_TICKS} ticks before the feature`
        : 'Reach full speed to prime stances';
    }

    const boardGuidance = this.root.querySelector('#board-guidance');
    if (boardGuidance) {
      boardGuidance.classList.toggle('hidden', snapshot.boardMounted);
    }

    const boardMountedControls = this.root.querySelector('#board-mounted-controls');
    if (boardMountedControls) {
      boardMountedControls.classList.toggle('hidden', !snapshot.boardMounted);
    }

    const dismountBtn = this.root.querySelector('#dismount-btn') as HTMLButtonElement | null;
    if (dismountBtn) {
      dismountBtn.disabled = !snapshot.canDismountBoard;
    }
  }

  setVisible(visible: boolean): void {
    this.root.classList.toggle('hidden', !visible);
  }

  private renderShell(): string {
    const a = OSRS_ASSETS;
    return `
      <div class="osrs-panel-chrome">
        <div class="osrs-panel-header">
          <img src="${a.surf.boardUpright}" alt="" class="osrs-panel-icon" width="18" height="18" />
          <span class="osrs-panel-title" id="board-tier-title">Camphor Board</span>
        </div>
        <div class="osrs-status-bar">
          <div class="osrs-status-bar-fill" id="combo-bar-fill" style="width: 100%; background: ${COMBO_BAR_IDLE_COLOR}"></div>
          <span class="osrs-status-bar-label" id="combo-label">Ready</span>
        </div>
        <div class="osrs-status-bar osrs-surf-boost-bar hidden" id="surf-boost-bar">
          <div class="osrs-status-bar-fill osrs-surf-boost-bar-fill" id="surf-boost-bar-fill" style="width: 100%; background: ${SURF_BOOST_BAR_COLOR}"></div>
          <span class="osrs-status-bar-label" id="surf-boost-label">Surf boost</span>
        </div>
        <div class="osrs-tab-row">
          <button type="button" class="osrs-stone-tab active" data-tab="board" title="Surfboard">
            <img src="${a.sailing.tabFacilities}" alt="Surfboard" width="20" height="20" />
          </button>
          <button type="button" class="osrs-stone-tab" data-tab="stats" title="Session stats">
            <img src="${a.sailing.tabStats}" alt="Session stats" width="20" height="20" />
          </button>
          <button type="button" class="osrs-stone-tab" data-tab="rewards" title="Coral rewards">
            <img src="${a.sailing.tabCrew}" alt="Coral rewards" width="20" height="20" />
          </button>
        </div>
        <div class="osrs-tab-body active" data-panel="board">
          <p class="osrs-panel-footnote" id="board-guidance">Board your surfboard on the beach shore to begin.</p>
          <div id="board-mounted-controls">
            <p class="osrs-panel-section-title">Surfboard</p>
            <div class="osrs-nav-row">
              <button type="button" class="osrs-stone-sprite-btn" data-nav-btn="toggle-full" title="Full speed ahead">
                <img src="${a.surf.ride}" alt="" width="26" height="26" />
              </button>
              <button type="button" class="osrs-stone-sprite-btn" data-nav-btn="speed-down" title="Slow down">
                <img src="${a.chevron.down}" alt="" width="20" height="20" />
              </button>
              <button type="button" class="osrs-stone-sprite-btn" data-nav-btn="speed-up" title="Increase speed">
                <img src="${a.chevron.up}" alt="" width="20" height="20" />
              </button>
            </div>
            <div class="osrs-steering-row">
              <img src="${a.sailing.notSteering}" alt="" id="steering-icon" width="20" height="20" />
              <span id="steering-label">Drifting</span>
            </div>
            <p class="osrs-panel-section-title">Stance</p>
            <div class="osrs-stance-row">
              ${STANCE_BUTTONS.map((stance) => this.renderStanceButton(stance)).join('')}
            </div>
            <p class="osrs-panel-footnote" id="stance-footnote">Reach full speed to prime stances</p>
            <button type="button" class="osrs-stone-btn" id="dismount-btn" disabled>Leave board on sand</button>
            <label class="osrs-check-row" title="Highlight the tile your character is actually on">
              <input type="checkbox" id="true-tile-toggle" />
              <span>True tile marker</span>
            </label>
          </div>
        </div>
        <div class="osrs-tab-body" data-panel="stats">
          <p class="osrs-panel-section-title">Session</p>
          <div class="osrs-stat-line">Combo: <span id="stats-combo">0</span></div>
          <div class="osrs-stat-line">Best combo: <span id="stats-max-combo">0</span></div>
          <div class="osrs-stat-line">Tricks landed: <span id="stats-tricks">0</span></div>
          <div class="osrs-stat-line">Coral Tokens: <span id="stats-tokens">0</span></div>
        </div>
        <div class="osrs-tab-body" data-panel="rewards">
          <p class="osrs-panel-section-title">Coral Token Shop</p>
          <div class="osrs-stat-line">Balance: <span id="coral-tokens-rewards">0</span></div>
          <button type="button" class="osrs-stone-btn" id="shop-btn">Open Reward Shop</button>
        </div>
      </div>
    `;
  }

  private renderStanceButton(stance: StanceButtonConfig): string {
    return `
      <button type="button" class="osrs-stone-sprite-btn osrs-stance-btn" data-prepare-slot="${stance.slot}" title="${stance.title}">
        <span class="osrs-stance-ticks"></span>
        <img src="${stance.icon}" alt="" width="24" height="24" />
        <span class="osrs-stance-name">${trickStanceName(stance.slot)}</span>
        <span class="osrs-stance-features">${stance.features}</span>
      </button>
    `;
  }

  private bindEvents(): void {
    for (const tab of this.root.querySelectorAll<HTMLButtonElement>('.osrs-stone-tab')) {
      bindUiPress(tab, () => {
        const id = tab.dataset.tab as PanelTab;
        this.activeTab = id;
        this.root
          .querySelectorAll('.osrs-stone-tab')
          .forEach((el) => el.classList.remove('active'));
        tab.classList.add('active');
        this.root.querySelectorAll('.osrs-tab-body').forEach((el) => {
          el.classList.toggle('active', (el as HTMLElement).dataset.panel === id);
        });
      });
    }

    this.root.querySelectorAll<HTMLButtonElement>('[data-nav-btn]').forEach((btn) => {
      bindUiPress(btn, () => {
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
      bindUiPress(btn, () => {
        if (btn.disabled) {
          return;
        }
        const slot = Number(btn.dataset.prepareSlot) as TrickPrepareSlot;
        this.callbacks.onPrepareTrick(slot);
      });
    });
    const shopBtn = this.root.querySelector('#shop-btn');
    if (shopBtn instanceof HTMLElement) {
      bindUiPress(shopBtn, () => {
        this.callbacks.onOpenShop();
      });
    }
    const dismountBtn = this.root.querySelector('#dismount-btn');
    if (dismountBtn instanceof HTMLElement) {
      bindUiPress(dismountBtn, () => {
        if (dismountBtn instanceof HTMLButtonElement && dismountBtn.disabled) {
          return;
        }
        this.callbacks.onDismountBoard();
      });
    }
    this.root.querySelector('#true-tile-toggle')?.addEventListener('change', (event) => {
      this.callbacks.onToggleTrueTile((event.target as HTMLInputElement).checked);
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

  private setText(selector: string, value: string): void {
    const el = this.root.querySelector(selector);
    if (el) {
      el.textContent = value;
    }
  }

  syncTokenDisplay(tokens: number): void {
    const rewards = this.root.querySelector('#coral-tokens-rewards');
    if (rewards) {
      rewards.textContent = String(tokens);
    }
  }
}
