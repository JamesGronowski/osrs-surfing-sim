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
import { bindPointerEvents, PixiRenderer } from './render/PixiRenderer.js';
import { SurfboardMotionInterpolator } from './render/visualSnapshot.js';
import { DebugPanel } from './ui/DebugPanel.js';
import { OsrsChatbox } from './ui/OsrsChatbox.js';
import { OsrsMinimap } from './ui/OsrsMinimap.js';
import { OsrsSailingPanel } from './ui/OsrsSailingPanel.js';
import { OsrsShopPanel } from './ui/OsrsShopPanel.js';
import { OsrsTabStrip } from './ui/OsrsTabStrip.js';
import { applyIntegerScale } from './ui/scaleLayout.js';

/** Pixels per world tile — lower = more zoomed out in the 512×334 viewport. */
const TILE_SIZE_PX = 10;

const HELP_LINES = [
  'Click the ground to walk. Click Kaulu to talk.',
  'Click your surfboard on the sand ring to paddle out.',
  'Prime Rail / Tunnel / Jump 1–4 ticks before you hit that coral feature.',
];

export class OsrsClient {
  private simulation: GameSimulation;
  private renderer: PixiRenderer;
  private chatbox: OsrsChatbox;
  private sidePanel: OsrsSailingPanel;
  private shopPanel: OsrsShopPanel;
  private debugPanel: DebugPanel;
  private minimap: OsrsMinimap;
  private unbindPointer: (() => void) | null = null;
  private visualFrameId: number | null = null;
  private lastVisualFrameMs = 0;
  /** Elapsed ms within the current tick period (0 … tickMs). Drives smooth movement. */
  private tickAccumulatorMs = 0;
  private tickBlend = 0;
  private readonly motion = new SurfboardMotionInterpolator();
  private tidePhaseFrom: number | null = null;
  private paused = false;

  private constructor(
    simulation: GameSimulation,
    renderer: PixiRenderer,
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

    const renderer = new PixiRenderer();
    await renderer.init(gameRoot, TILE_SIZE_PX);

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
    client.wireViewport(gameRoot);
    client.startTickLoop();

    installSurfTestBridge(simulation, {
      pause: () => client.setPaused(true),
      resume: () => client.setPaused(false),
      renderFrame: () => client.renderFrame(),
      afterTick: () => {
        const snapshot = simulation.getSnapshot();
        renderer.syncMapAfterTick(snapshot, simulation.getArena().map);
      },
    });

    window.addEventListener('keydown', client.onKeyDown);
    window.addEventListener('beforeunload', () => client.destroy());

    return client;
  }

  private wireViewport(gameRoot: HTMLElement): void {
    const canvas = gameRoot.querySelector('canvas');
    if (!canvas) {
      throw new Error('Canvas not found');
    }

    this.unbindPointer = bindPointerEvents(
      canvas,
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
      (x, y) => this.renderer.screenToWorld(x, y),
    );
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const slot = TRICK_KEY_SLOTS[event.code];
    if (slot !== undefined) {
      event.preventDefault();
      this.simulation.prepareTrick(slot);
    }
  };

  private setPaused(value: boolean): void {
    this.paused = value;
    if (!value) {
      this.lastVisualFrameMs = performance.now();
    }
  }

  private startTickLoop(): void {
    const now = performance.now();
    this.lastVisualFrameMs = now;
    this.tickAccumulatorMs = 0;
    this.tickBlend = 0;
    this.visualFrameId = requestAnimationFrame((frameNow) => this.onVisualFrame(frameNow));
  }

  private onGameTick(): void {
    const beforeTick = this.simulation.getSnapshot();
    this.tidePhaseFrom = beforeTick.tide?.phaseRadians ?? null;

    this.simulation.tick();

    const snapshot = this.simulation.getSnapshot();
    this.motion.onSimulationTick(beforeTick, snapshot, this.simulation.tickMs);
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
      this.renderer.showXpDrop(
        `+${drop.agility} Agil +${drop.sailing} Sail +${drop.tokens} Tokens`,
        drop.x,
        drop.y,
      );
      this.chatbox.push(
        `+${drop.agility} Agility XP, +${drop.sailing} Sailing XP, +${drop.tokens} Coral Tokens`,
        'xp',
      );
    }
  }

  private advanceMotionAndSimulation(deltaMs: number): void {
    const tickMs = this.simulation.tickMs;
    let msLeft = deltaMs;

    const msUntilTick = tickMs - this.tickAccumulatorMs;
    const beforeTickMs = Math.min(msLeft, msUntilTick);
    if (beforeTickMs > 0) {
      this.motion.advance(beforeTickMs);
      this.tickAccumulatorMs += beforeTickMs;
      msLeft -= beforeTickMs;
    }

    if (this.tickAccumulatorMs >= tickMs) {
      this.tickAccumulatorMs = 0;
      this.onGameTick();

      if (msLeft > 0) {
        this.motion.advance(msLeft);
        this.tickAccumulatorMs += msLeft;
      }
    }
  }

  private onVisualFrame(now: number): void {
    const deltaMs = this.lastVisualFrameMs > 0 ? now - this.lastVisualFrameMs : 0;

    if (!this.paused && deltaMs > 0) {
      this.advanceMotionAndSimulation(deltaMs);
      this.tickBlend = this.tickAccumulatorMs / this.simulation.tickMs;
      this.renderVisuals(now);
    }

    this.lastVisualFrameMs = now;
    this.visualFrameId = requestAnimationFrame((frameNow) => this.onVisualFrame(frameNow));
  }

  private renderVisuals(visualTimeMs = performance.now()): void {
    const snapshot = this.simulation.getSnapshot();
    const map = this.simulation.getArena().map;
    const displaySnapshot = this.motion.buildDisplaySnapshot(
      snapshot,
      this.tidePhaseFrom,
      this.tickBlend,
    );
    this.renderer.render(displaySnapshot, map, visualTimeMs);
  }

  private renderFrame(): void {
    this.renderVisuals();
  }

  destroy(): void {
    if (this.visualFrameId !== null) {
      cancelAnimationFrame(this.visualFrameId);
    }
    this.unbindPointer?.();
    window.removeEventListener('keydown', this.onKeyDown);
    this.renderer.destroy();
  }
}
