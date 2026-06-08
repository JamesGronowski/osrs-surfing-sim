import { speedStatToTilesPerTick, type SimulationSnapshot } from '@osrs-surfing/engine';

export interface DebugTuning {
  turnRate: number;
  speedPaddle: number;
  speedRide: number;
}

export class DebugPanel {
  private root: HTMLElement;
  private tuning: DebugTuning;

  constructor(root: HTMLElement, initial: DebugTuning, onChange: (tuning: DebugTuning) => void) {
    this.root = root;
    this.tuning = { ...initial };
    this.root.innerHTML = `
      <div><strong>Debug</strong> [1/2/3] tune turn/paddle/ride</div>
      <div id="debug-lines"></div>
    `;

    window.addEventListener('keydown', (event) => {
      if (event.key === '1') {
        this.tuning.turnRate = Math.max(5, this.tuning.turnRate - 2.5);
        onChange(this.tuning);
      }
      if (event.key === '2') {
        this.tuning.speedPaddle = Math.max(1, this.tuning.speedPaddle - 1);
        onChange(this.tuning);
      }
      if (event.key === '3') {
        this.tuning.speedRide = Math.max(1, this.tuning.speedRide - 1);
        onChange(this.tuning);
      }
      if (event.key === '!') {
        this.tuning.turnRate += 2.5;
        onChange(this.tuning);
      }
      if (event.key === '@') {
        this.tuning.speedPaddle += 1;
        onChange(this.tuning);
      }
      if (event.key === '#') {
        this.tuning.speedRide += 1;
        onChange(this.tuning);
      }
    });
  }

  update(snapshot: SimulationSnapshot): void {
    const lines = this.root.querySelector('#debug-lines');
    if (!lines) {
      return;
    }
    const { surfboard } = snapshot;
    lines.innerHTML = `
      pos: ${surfboard.position.x.toFixed(2)}, ${surfboard.position.y.toFixed(2)}<br/>
      heading: ${surfboard.currentHeading} → ${surfboard.intendedHeading}<br/>
      speed: ${surfboard.speedState} | rotating: ${surfboard.isRotating}<br/>
      turn: ${this.tuning.turnRate}° paddle: ${speedStatToTilesPerTick(this.tuning.speedPaddle)} ride: ${speedStatToTilesPerTick(this.tuning.speedRide)} tiles/tick<br/>
      tide: ${snapshot.tide ? `${((snapshot.tide.phaseRadians * 180) / Math.PI).toFixed(0)}° sweep` : 'off'}<br/>
      tick: ${snapshot.tickCount}
    `;
  }
}
