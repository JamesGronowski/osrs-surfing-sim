import {
  createCoralParkSlice,
  DEFAULT_SURFBOARD_STATS,
  GameSimulation,
  type TrickPrepareSlot,
} from '@osrs-surfing/engine';

const TRICK_KEY_SLOTS: Partial<Record<string, TrickPrepareSlot>> = {
  Digit1: 0,
  Digit2: 1,
  Digit3: 2,
};

import { installSurfTestBridge } from './dev/surfTestBridge.js';
import { ThreeRenderer } from './render/ThreeRenderer.js';
import { SurfboardMotionInterpolator } from './render/visualSnapshot.js';
import { DebugPanel } from './ui/DebugPanel.js';
import { OsrsChatbox } from './ui/OsrsChatbox.js';
import { OsrsMinimap } from './ui/OsrsMinimap.js';
import { OsrsSailingPanel } from './ui/OsrsSailingPanel.js';
import { OsrsShopPanel } from './ui/OsrsShopPanel.js';
import { OsrsTabStrip } from './ui/OsrsTabStrip.js';
import { applyIntegerScale } from './ui/scaleLayout.js';

const HELP_LINES = [
  'Click the ground to walk. Click Kaulu to talk.',
  'Click your surfboard on the sand ring to paddle out.',
  'Prime Low, Medium, or High stance 1–4 ticks before you hit the matching coral feature.',
];

export class OsrsClient {
  private simulation: GameSimulation;
  private renderer: ThreeRenderer;
  private chatbox: OsrsChatbox;
  private sidePanel: OsrsSailingPanel;
  private shopPanel: OsrsShopPanel;
  private debugPanel: DebugPanel;
  private minimap: OsrsMinimap;
  private unbindPointer: (() => void) | null = null;
  private visualFrameId: number | null = null;
  private lastVisualFrameMs = 0;
  /** Ms elapsed within the current tick period (0 … tickMs). */
  private tickAccumulatorMs = 0;
  readonly motion = new SurfboardMotionInterpolator();
  private tidePhaseFrom: number | null = null;
  private paused = false;
  private lastDisplayPosition = { x: 0, y: 0 };
  private lastTickBlend = 0;

  private constructor(
    simulation: GameSimulation,
    renderer: ThreeRenderer,
    chatbox: OsrsChatbox,
    sidePanel: OsrsSailingPanel,
    shopPanel: OsrsShopPanel,
    debugPanel: DebugPanel,
    minimap: OsrsMinimap,
  ) {
    this.simulation = simulation;
    this.renderer = renderer;
    this.chatbox = chatbox;
    this.sidePanel = sidePanel;
    this.shopPanel = shopPanel;
    this.debugPanel = debugPanel;
    this.minimap = minimap;
  }

  static async mount(): Promise<OsrsClient> {
    const scaleShell = document.getElementById('osrs-scale-shell');
    const scaleWrap = document.getElementById('osrs-scale-wrap');
    if (scaleShell && scaleWrap) {
      applyIntegerScale(scaleShell, scaleWrap);
      window.addEventListener('resize', () => applyIntegerScale(scaleShell, scaleWrap));
    }

    const simulation = new GameSimulation({ arena: createCoralParkSlice() });

    const gameRoot = document.getElementById('game-root');
    const sidePanelRoot = document.getElementById('side-panel');
    const shopPanelRoot = document.getElementById('shop-panel');
    const debugPanelRoot = document.getElementById('debug-panel');
    const chatboxRoot = document.getElementById('chatbox-root');
    const tabStripRoot = document.getElementById('tab-strip');
    const minimapRoot = document.getElementById('minimap-canvas');

    if (
      !gameRoot ||
      !sidePanelRoot ||
      !shopPanelRoot ||
      !debugPanelRoot ||
      !chatboxRoot ||
      !tabStripRoot ||
      !minimapRoot
    ) {
      throw new Error('Missing required DOM elements');
    }

    const renderer = new ThreeRenderer();
    await renderer.init(gameRoot, 1);

    new OsrsTabStrip(tabStripRoot);
    const minimap = new OsrsMinimap(minimapRoot);
    const chatbox = new OsrsChatbox(chatboxRoot);
    for (const line of HELP_LINES) {
      chatbox.push(line, 'game');
    }

    const debugTuning = {
      turnRate: DEFAULT_SURFBOARD_STATS.turnRateDegPerTick,
      speedPaddle: DEFAULT_SURFBOARD_STATS.speedPaddle,
      speedRide: DEFAULT_SURFBOARD_STATS.speedRide,
    };
    simulation.setStats({
      turnRateDegPerTick: debugTuning.turnRate,
      speedPaddle: debugTuning.speedPaddle,
      speedRide: debugTuning.speedRide,
    });

    const debugPanel = new DebugPanel(debugPanelRoot, debugTuning, (tuning) => {
      simulation.setStats({
        turnRateDegPerTick: tuning.turnRate,
        speedPaddle: tuning.speedPaddle,
        speedRide: tuning.speedRide,
      });
    });

    const shopPanel = new OsrsShopPanel(shopPanelRoot, (unlockId) => {
      const error = simulation.tryPurchaseUnlock(unlockId);
      if (error) {
        chatbox.push(error, 'system');
      }
      const snapshot = simulation.getSnapshot();
      shopPanel.update(snapshot.progression);
      sidePanel.update(snapshot);
    });

    const sidePanel = new OsrsSailingPanel(sidePanelRoot, {
      onSpeedState: (state) => simulation.setSpeedState(state),
      onLieDown: () => {
        const state = simulation.getSnapshot().surfboard.speedState;
        if (state === 'riding') {
          simulation.setSpeedState('paddling');
        } else {
          simulation.setSpeedState('seated');
        }
      },
      onOpenShop: () => {
        shopPanel.toggle();
        shopPanel.update(simulation.getSnapshot().progression);
      },
      onPrepareTrick: (slot) => simulation.prepareTrick(slot),
    });

    const client = new OsrsClient(
      simulation,
      renderer,
      chatbox,
      sidePanel,
      shopPanel,
      debugPanel,
      minimap,
    );

    const spawnSnapshot = simulation.getSnapshot();
    client.motion.reset(spawnSnapshot);
    client.tidePhaseFrom = spawnSnapshot.tide?.phaseRadians ?? null;
    client.wireViewport();
    client.startTickLoop();

    installSurfTestBridge(simulation, {
      pause: () => client.setPaused(true),
      resume: () => client.setPaused(false),
      renderFrame: () => client.renderFrame(),
      getDisplayPosition: () => client.getDisplayPosition(),
      getTickBlend: () => client.getTickBlend(),
      onSimulationTick: (before, after) => client.motion.onSimulationTick(before, after),
      afterTick: () => {
        const snapshot = simulation.getSnapshot();
        renderer.syncMapAfterTick(snapshot, simulation.getArena().map);
      },
    });

    window.addEventListener('keydown', client.onKeyDown);
    window.addEventListener('keyup', client.onKeyUp);
    window.addEventListener('beforeunload', () => client.destroy());

    return client;
  }

  private wireViewport(): void {
    this.unbindPointer = this.renderer.bindPointerInput(
      (worldX, worldY) => {
        if (Number.isNaN(worldX)) {
          this.simulation.clearCursor();
          return;
        }
        this.simulation.setCursor(worldX, worldY);
      },
      (worldX, worldY) => {
        this.simulation.clickWorld(worldX, worldY);
      },
    );
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (this.renderer.handleKeyDown(event)) {
      event.preventDefault();
      return;
    }
    const slot = TRICK_KEY_SLOTS[event.code];
    if (slot !== undefined) {
      event.preventDefault();
      this.simulation.prepareTrick(slot);
    }
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    if (this.renderer.handleKeyUp(event)) {
      event.preventDefault();
    }
  };

  private setPaused(value: boolean): void {
    this.paused = value;
    if (!value) {
      this.lastVisualFrameMs = performance.now();
    }
  }

  private startTickLoop(): void {
    this.lastVisualFrameMs = performance.now();
    this.tickAccumulatorMs = 0;
    this.visualFrameId = requestAnimationFrame((frameNow) => this.onVisualFrame(frameNow));
  }

  private onGameTick(): void {
    const beforeTick = this.simulation.getSnapshot();
    this.tidePhaseFrom = beforeTick.tide?.phaseRadians ?? null;

    this.simulation.tick();

    const snapshot = this.simulation.getSnapshot();
    this.motion.onSimulationTick(beforeTick, snapshot);
    const map = this.simulation.getArena().map;
    this.renderer.syncMapAfterTick(snapshot, map);
    this.sidePanel.update(snapshot);
    this.shopPanel.update(snapshot.progression);
    this.debugPanel.update(snapshot);
    this.minimap.update(snapshot, map);

    for (const line of this.simulation.consumeDialogue()) {
      this.chatbox.push(line, 'game');
    }

    for (const drop of this.simulation.consumeXpDrops()) {
      const tokenPart = drop.tokens > 0 ? ` +${drop.tokens} Tokens` : '';
      this.renderer.showXpDrop(
        `+${drop.agility} Agil +${drop.sailing} Sail${tokenPart}`,
        drop.x,
        drop.y,
      );
      const chatTokenPart = drop.tokens > 0 ? `, +${drop.tokens} Coral Tokens` : '';
      this.chatbox.push(
        `+${drop.agility} Agility XP, +${drop.sailing} Sailing XP${chatTokenPart}`,
        'xp',
      );
    }
  }

  private onVisualFrame(now: number): void {
    if (!this.paused) {
      const tickMs = this.simulation.tickMs;
      const deltaMs =
        this.lastVisualFrameMs > 0
          ? Math.min(tickMs, Math.max(0, now - this.lastVisualFrameMs))
          : 0;

      if (deltaMs > 0) {
        this.tickAccumulatorMs += deltaMs;

        if (this.tickAccumulatorMs >= tickMs) {
          this.tickAccumulatorMs -= tickMs;
          this.onGameTick();
        }

        const tickBlend = this.tickAccumulatorMs / tickMs;
        this.renderVisuals(now, tickBlend);
      }
    }

    this.lastVisualFrameMs = now;
    this.visualFrameId = requestAnimationFrame((frameNow) => this.onVisualFrame(frameNow));
  }

  private renderVisuals(visualTimeMs = performance.now(), tickBlend = 0): void {
    const snapshot = this.simulation.getSnapshot();
    const map = this.simulation.getArena().map;
    this.motion.ensureSynced(snapshot);
    const displaySnapshot = this.motion.buildDisplaySnapshot(
      snapshot,
      this.tidePhaseFrom,
      tickBlend,
    );
    this.lastDisplayPosition = { ...displaySnapshot.surfboard.position };
    this.lastTickBlend = tickBlend;
    this.renderer.render(displaySnapshot, map, visualTimeMs);
  }

  private renderFrame(): void {
    this.renderVisuals(performance.now(), this.lastTickBlend);
  }

  getDisplayPosition(): { x: number; y: number } {
    return { ...this.lastDisplayPosition };
  }

  getTickBlend(): number {
    return this.lastTickBlend;
  }

  destroy(): void {
    if (this.visualFrameId !== null) {
      cancelAnimationFrame(this.visualFrameId);
    }
    this.unbindPointer?.();
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.renderer.destroy();
  }
}
