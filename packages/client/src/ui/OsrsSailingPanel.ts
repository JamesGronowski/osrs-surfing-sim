import {
  agilityLevel,
  sailingLevel,
  type SimulationSnapshot,
  type SpeedState,
} from '@osrs-surfing/engine';

import { OSRS_ASSETS } from './osrsAssets.js';

import type { TrickPrepareSlot } from '@osrs-surfing/engine';

export interface OsrsSailingPanelCallbacks {
  onSpeedState: (state: SpeedState) => void;
  onOpenShop: () => void;
  onPrepareTrick: (slot: TrickPrepareSlot) => void;
  onLieDown: () => void;
}

type PanelTab = 'stats' | 'movement' | 'rewards';

export class OsrsSailingPanel {
  private root: HTMLElement;
  private callbacks: OsrsSailingPanelCallbacks;
  private activeTab: PanelTab = 'movement';
  private speedState: SpeedState = 'seated';

  constructor(root: HTMLElement, callbacks: OsrsSailingPanelCallbacks) {
    this.root = root;
    this.callbacks = callbacks;
    this.root.className = 'osrs-sailing-panel';
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

    this.setActiveSpeed(snapshot.surfboard.speedState);

    const comboFill = this.root.querySelector('#combo-bar-fill') as HTMLElement;
    const comboLabel = this.root.querySelector('#combo-label');
    if (comboFill && comboLabel) {
      const combo = snapshot.progression.session.combo;
      const pct = Math.min(100, combo * 20);
      comboFill.style.width = `${pct}%`;
      comboLabel.textContent = combo > 0 ? `Combo x${combo}` : 'Combo';
    }

    const agility = snapshot.progression.xp.agility;
    const sailing = snapshot.progression.xp.sailing;
    this.updateSkillRow('agility', agilityLevel(agility), agility % 1000, 1000);
    this.updateSkillRow('sailing', sailingLevel(sailing), sailing % 1200, 1200);

    const tokens = String(snapshot.progression.coralTokens);
    const tokenEl = this.root.querySelector('#coral-tokens');
    if (tokenEl) {
      tokenEl.textContent = tokens;
    }
    this.syncTokenDisplay(snapshot.progression.coralTokens);

    const tricksEl = this.root.querySelector('#tricks-landed');
    if (tricksEl) {
      tricksEl.textContent = String(snapshot.progression.session.tricksLanded);
    }

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
          <button type="button" class="osrs-tab" data-tab="stats" title="Stats">
            <img src="${a.sailing.tabStats}" alt="Stats" width="28" height="28" />
          </button>
          <button type="button" class="osrs-tab active" data-tab="movement" title="Movement">
            <img src="${a.sailing.tabFacilities}" alt="Movement" width="28" height="28" />
          </button>
          <button type="button" class="osrs-tab" data-tab="rewards" title="Rewards">
            <img src="${a.sailing.tabCrew}" alt="Rewards" width="28" height="28" />
          </button>
        </div>
        <div class="osrs-tab-body" data-panel="stats">
          <div class="osrs-stat-row">
            <img src="${a.skill.agility}" alt="" width="18" height="18" />
            <span id="agility-label">Agility 1</span>
            <div class="osrs-xp-track"><div class="osrs-xp-fill agility" id="agility-fill"></div></div>
          </div>
          <div class="osrs-stat-row">
            <img src="${a.skill.sailing}" alt="" width="18" height="18" />
            <span id="sailing-label">Sailing 1</span>
            <div class="osrs-xp-track"><div class="osrs-xp-fill sailing" id="sailing-fill"></div></div>
          </div>
          <div class="osrs-stat-line">Tricks: <span id="tricks-landed">0</span></div>
          <div class="osrs-stat-line">Coral Tokens: <span id="coral-tokens">0</span></div>
        </div>
        <div class="osrs-tab-body active" data-panel="movement">
          <p class="osrs-section-label">Navigation</p>
          <div class="osrs-movement-grid">
            <button type="button" class="osrs-sprite-btn" data-action="lie-down" title="Lie down (paddle)">
              <img src="${a.sailing.reverse}" alt="Lie down" />
            </button>
            <button type="button" class="osrs-sprite-btn" data-action="speed-up" title="Stand — ride swell">
              <img src="${a.chevron.up}" alt="Faster" />
            </button>
            <button type="button" class="osrs-sprite-btn" disabled aria-hidden="true"></button>
            <button type="button" class="osrs-sprite-btn osrs-boat-center" disabled aria-hidden="true">
              <img src="${a.sailing.raft}" alt="" id="boat-center-icon" />
            </button>
            <button type="button" class="osrs-sprite-btn" data-action="paddle" title="Paddle">
              <img src="${a.sailing.sails}" alt="Paddle" />
            </button>
            <button type="button" class="osrs-sprite-btn" data-action="speed-down" title="Slow / seated">
              <img src="${a.chevron.down}" alt="Slower" />
            </button>
            <button type="button" class="osrs-sprite-btn" data-action="stop" title="Stop — seated">
              <img src="${a.sailing.unsetSailsFast}" alt="Stop" id="stop-icon" />
            </button>
            <img src="${a.sailing.steering}" alt="" class="osrs-steering-badge" id="steering-icon" />
          </div>
          <div class="osrs-movement-row">
            <button type="button" class="osrs-sprite-btn wide" data-action="paddle" title="Start paddling">
              <img src="${a.sailing.unsetSailsSlow}" alt="Paddle" />
              <span>Paddle</span>
            </button>
            <button type="button" class="osrs-sprite-btn wide" data-action="ride" title="Stand on swell">
              <img src="${a.sailing.setSails}" alt="Ride" />
              <span>Ride</span>
            </button>
          </div>
          <p class="osrs-section-label">Trick rhythm</p>
          <div class="osrs-trick-prepare-row">
            <button type="button" class="osrs-trick-prepare-btn" data-prepare-slot="0" title="Prime rail (1)">
              <span class="prepare-label">Rail</span>
              <span class="prepare-ticks">·</span>
            </button>
            <button type="button" class="osrs-trick-prepare-btn" data-prepare-slot="1" title="Prime tunnel (2)">
              <span class="prepare-label">Tunnel</span>
              <span class="prepare-ticks">·</span>
            </button>
            <button type="button" class="osrs-trick-prepare-btn" data-prepare-slot="2" title="Prime jump (3)">
              <span class="prepare-label">Jump</span>
              <span class="prepare-ticks">·</span>
            </button>
          </div>
          <p class="osrs-hint">Prime 1–4 ticks before you hit the matching coral. Too early or late = bail.</p>
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

    this.root.querySelectorAll('[data-action="paddle"]').forEach((btn) => {
      btn.addEventListener('click', () => this.callbacks.onSpeedState('paddling'));
    });
    this.root.querySelectorAll('[data-action="ride"]').forEach((btn) => {
      btn.addEventListener('click', () => this.callbacks.onSpeedState('riding'));
    });
    this.root.querySelectorAll('[data-action="stop"]').forEach((btn) => {
      btn.addEventListener('click', () => this.callbacks.onSpeedState('seated'));
    });
    this.root.querySelector('[data-action="lie-down"]')?.addEventListener('click', () => {
      this.callbacks.onLieDown();
    });
    this.root.querySelector('[data-action="speed-up"]')?.addEventListener('click', () => {
      if (this.speedState === 'seated') {
        this.callbacks.onSpeedState('paddling');
      } else {
        this.callbacks.onSpeedState('riding');
      }
    });
    this.root.querySelector('[data-action="speed-down"]')?.addEventListener('click', () => {
      if (this.speedState === 'riding') {
        this.callbacks.onLieDown();
      } else {
        this.callbacks.onSpeedState('seated');
      }
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

  private setActiveSpeed(state: SpeedState): void {
    this.root.querySelectorAll<HTMLElement>('.osrs-sprite-btn[data-action]').forEach((btn) => {
      const action = btn.dataset.action;
      const active =
        (action === 'paddle' && state === 'paddling') ||
        (action === 'ride' && state === 'riding') ||
        (action === 'stop' && state === 'seated');
      btn.classList.toggle('active', active);
    });
  }

  private updateSkillRow(
    skill: 'agility' | 'sailing',
    level: number,
    current: number,
    max: number,
  ): void {
    const label = this.root.querySelector(`#${skill}-label`);
    const fill = this.root.querySelector(`#${skill}-fill`) as HTMLElement;
    if (label) {
      label.textContent = `${skill === 'agility' ? 'Agility' : 'Sailing'} ${level}`;
    }
    if (fill) {
      fill.style.width = `${Math.min(100, (current / max) * 100)}%`;
    }
  }

  syncTokenDisplay(tokens: number): void {
    const rewards = this.root.querySelector('#coral-tokens-rewards');
    if (rewards) {
      rewards.textContent = String(tokens);
    }
  }
}
