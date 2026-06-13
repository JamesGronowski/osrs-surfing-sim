import {
  canPurchaseUnlock,
  type ProgressionState,
  UNLOCK_REGISTRY,
  type UnlockId,
} from '@osrs-surfing/engine';

import { bindUiPress } from './bindUiPress.js';
import { OSRS_ASSETS } from './osrsAssets.js';

export class OsrsShopPanel {
  private root: HTMLElement;
  private onPurchase: (id: UnlockId) => void;
  private visible = false;

  constructor(root: HTMLElement, onPurchase: (id: UnlockId) => void) {
    this.root = root;
    this.onPurchase = onPurchase;
    this.root.className = 'osrs-shop-panel hidden';
  }

  toggle(): void {
    this.visible = !this.visible;
    this.root.classList.toggle('hidden', !this.visible);
  }

  hide(): void {
    this.visible = false;
    this.root.classList.add('hidden');
  }

  update(progression: ProgressionState): void {
    this.root.innerHTML = `
      <div class="osrs-shop-chrome">
        <div class="osrs-panel-header">
          <img src="${OSRS_ASSETS.sailing.tabCrew}" alt="" width="20" height="20" />
          <span class="osrs-panel-title">Coral Rewards</span>
        </div>
        <p class="osrs-stat-line">Coral Tokens: <strong>${progression.coralTokens}</strong></p>
        <div class="osrs-shop-list">
          ${UNLOCK_REGISTRY.map((unlock) => this.renderUnlock(unlock, progression)).join('')}
        </div>
      </div>
    `;

    for (const unlock of UNLOCK_REGISTRY) {
      const button = this.root.querySelector(
        `[data-unlock="${unlock.id}"]`,
      ) as HTMLButtonElement | null;
      if (!button || unlock.earnOnly) {
        continue;
      }
      bindUiPress(button, () => this.onPurchase(unlock.id));
    }
  }

  private renderUnlock(
    unlock: (typeof UNLOCK_REGISTRY)[number],
    progression: ProgressionState,
  ): string {
    const owned = progression.unlocked.has(unlock.id);
    const check = canPurchaseUnlock(progression, unlock);
    const costLabel = unlock.tokenCost === null ? 'Earn only' : `${unlock.tokenCost} Coral Tokens`;
    const status = owned ? 'Unlocked' : check.ok ? 'Purchase' : (check.reason ?? 'Locked');

    return `
      <div class="osrs-shop-item">
        <div class="osrs-shop-item-title">${unlock.name}</div>
        <div class="osrs-shop-item-desc">${unlock.description}</div>
        <div class="osrs-shop-item-cost">${costLabel}</div>
        <button type="button" class="osrs-stone-btn" data-unlock="${unlock.id}" ${owned || !check.ok ? 'disabled' : ''}>
          ${status}
        </button>
      </div>
    `;
  }
}
