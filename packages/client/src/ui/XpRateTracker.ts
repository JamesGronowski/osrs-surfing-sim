const XP_RATE_WINDOW_MS = 5 * 60_000;
const MIN_RATE_DURATION_MS = 1_000;

interface XpSample {
  at: number;
  agility: number;
  sailing: number;
}

export interface XpRates {
  agility: number;
  sailing: number;
  total: number;
}

export class XpRateTracker {
  private samples: XpSample[] = [];

  record(agility: number, sailing: number, at = performance.now()): void {
    if (agility <= 0 && sailing <= 0) {
      return;
    }
    this.samples.push({ at, agility, sailing });
    this.prune(at);
  }

  rates(now = performance.now()): XpRates {
    this.prune(now);
    if (this.samples.length === 0) {
      return { agility: 0, sailing: 0, total: 0 };
    }

    let agility = 0;
    let sailing = 0;
    for (const sample of this.samples) {
      agility += sample.agility;
      sailing += sample.sailing;
    }

    const oldestAt = this.samples[0].at;
    const durationMs = Math.max(now - oldestAt, MIN_RATE_DURATION_MS);
    const hours = durationMs / 3_600_000;

    return {
      agility: Math.round(agility / hours),
      sailing: Math.round(sailing / hours),
      total: Math.round((agility + sailing) / hours),
    };
  }

  private prune(now: number): void {
    const cutoff = now - XP_RATE_WINDOW_MS;
    while (this.samples.length > 0 && this.samples[0].at < cutoff) {
      this.samples.shift();
    }
  }
}
