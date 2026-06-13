import { skillXpProgress, type SimulationSnapshot } from '@osrs-surfing/engine';

import { OSRS_ASSETS } from './osrsAssets.js';
import type { XpRateTracker } from './XpRateTracker.js';

function formatXpPerHour(rate: number): string {
  if (rate <= 0) {
    return '0/h';
  }
  if (rate >= 1_000_000) {
    return `${(rate / 1_000_000).toFixed(1)}M/h`;
  }
  if (rate >= 10_000) {
    return `${Math.round(rate / 1_000)}k/h`;
  }
  return `${rate.toLocaleString()}/h`;
}

export class OsrsViewportXpHud {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.root.className = 'osrs-viewport-xp-hud';
    this.root.innerHTML = this.renderShell();
  }

  update(snapshot: SimulationSnapshot, xpRates: XpRateTracker): void {
    const agility = snapshot.progression.xp.agility;
    const sailing = snapshot.progression.xp.sailing;
    const agilityProgress = skillXpProgress(agility);
    const sailingProgress = skillXpProgress(sailing);
    const rates = xpRates.rates();

    this.updateSkillRow('agility', agilityProgress.level, agilityProgress.percent, rates.agility);
    this.updateSkillRow('sailing', sailingProgress.level, sailingProgress.percent, rates.sailing);

    const totalRate = this.root.querySelector('#viewport-total-xp-rate');
    if (totalRate) {
      totalRate.textContent = formatXpPerHour(rates.total);
    }
  }

  private renderShell(): string {
    const assets = OSRS_ASSETS;
    return `
      <div class="osrs-viewport-xp-hud-panel">
        <div class="osrs-viewport-xp-row">
          <img src="${assets.skill.agility}" alt="" width="16" height="16" />
          <span class="osrs-viewport-xp-label" id="viewport-agility-label">Agility 1</span>
          <div class="osrs-viewport-xp-track">
            <div class="osrs-viewport-xp-fill agility" id="viewport-agility-fill"></div>
          </div>
          <span class="osrs-viewport-xp-rate" id="viewport-agility-rate">0/h</span>
        </div>
        <div class="osrs-viewport-xp-row">
          <img src="${assets.skill.sailing}" alt="" width="16" height="16" />
          <span class="osrs-viewport-xp-label" id="viewport-sailing-label">Sailing 1</span>
          <div class="osrs-viewport-xp-track">
            <div class="osrs-viewport-xp-fill sailing" id="viewport-sailing-fill"></div>
          </div>
          <span class="osrs-viewport-xp-rate" id="viewport-sailing-rate">0/h</span>
        </div>
        <div class="osrs-viewport-xp-total">
          Total <span id="viewport-total-xp-rate">0/h</span>
        </div>
      </div>
    `;
  }

  private updateSkillRow(
    skill: 'agility' | 'sailing',
    level: number,
    percent: number,
    rate: number,
  ): void {
    const label = this.root.querySelector(`#viewport-${skill}-label`);
    const fill = this.root.querySelector(`#viewport-${skill}-fill`) as HTMLElement | null;
    const rateEl = this.root.querySelector(`#viewport-${skill}-rate`);

    if (label) {
      label.textContent = `${skill === 'agility' ? 'Agility' : 'Sailing'} ${level}`;
    }
    if (fill) {
      fill.style.width = `${percent}%`;
    }
    if (rateEl) {
      rateEl.textContent = formatXpPerHour(rate);
    }
  }
}
