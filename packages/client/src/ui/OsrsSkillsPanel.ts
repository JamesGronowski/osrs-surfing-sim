import {
  agilityLevel,
  sailingLevel,
  skillXpProgress,
  type SimulationSnapshot,
} from '@osrs-surfing/engine';

import { OSRS_ASSETS } from './osrsAssets.js';

export class OsrsSkillsPanel {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.root.className = 'osrs-control-panel osrs-skills-panel hidden';
    this.root.innerHTML = this.renderShell();
  }

  update(snapshot: SimulationSnapshot): void {
    const agility = snapshot.progression.xp.agility;
    const sailing = snapshot.progression.xp.sailing;
    this.updateSkillRow('agility', agilityLevel(agility), skillXpProgress(agility).percent);
    this.updateSkillRow('sailing', sailingLevel(sailing), skillXpProgress(sailing).percent);

    const tricksEl = this.root.querySelector('#tricks-landed');
    if (tricksEl) {
      tricksEl.textContent = String(snapshot.progression.session.tricksLanded);
    }

    const tokensEl = this.root.querySelector('#coral-tokens');
    if (tokensEl) {
      tokensEl.textContent = String(snapshot.progression.coralTokens);
    }

    const totalLevel = agilityLevel(agility) + sailingLevel(sailing);
    const totalEl = this.root.querySelector('#total-level');
    if (totalEl) {
      totalEl.textContent = String(totalLevel);
    }
  }

  setVisible(visible: boolean): void {
    this.root.classList.toggle('hidden', !visible);
  }

  private renderShell(): string {
    const a = OSRS_ASSETS;
    return `
      <div class="osrs-panel-chrome">
        <p class="osrs-section-label">Skills</p>
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
        <div class="osrs-stat-line">Total level: <span id="total-level">2</span></div>
        <p class="osrs-section-label">Session</p>
        <div class="osrs-stat-line">Tricks: <span id="tricks-landed">0</span></div>
        <div class="osrs-stat-line">Coral Tokens: <span id="coral-tokens">0</span></div>
      </div>
    `;
  }

  private updateSkillRow(skill: 'agility' | 'sailing', level: number, percent: number): void {
    const label = this.root.querySelector(`#${skill}-label`);
    const fill = this.root.querySelector(`#${skill}-fill`) as HTMLElement;
    if (label) {
      label.textContent = `${skill === 'agility' ? 'Agility' : 'Sailing'} ${level}`;
    }
    if (fill) {
      fill.style.width = `${percent}%`;
    }
  }
}
