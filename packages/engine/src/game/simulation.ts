import { DEFAULT_SURFBOARD_STATS, TICK_MS } from '../constants/movement.js';
import {
  awardTrick,
  COMBO_TIMEOUT_TICKS,
  createProgressionState,
  decayCombo,
  purchaseUnlock,
} from '../progression/progression.js';
import type { ProgressionState, UnlockId } from '../progression/types.js';
import { type OnFootWalkState, planWalkPath, tickOnFootPath } from '../movement/onFoot.js';
import { headingFromClick } from '../movement/surfboard.js';
import {
  createSurfboard,
  tickSurfboard,
  type SpeedState,
  type SurfboardInput,
  type SurfboardState,
  type SurfboardStats,
} from '../movement/surfboard.js';
import { isWorldPointNavigable, isWorldPointSailingTarget } from '../world/collision.js';
import {
  findNpcAt,
  findNpcNear,
  findNpcOnTile,
  isNearNpc,
  type NpcDefinition,
} from '../world/npc.js';
import type { TrickPrepareSlot } from '../constants/tricks.js';
import {
  advanceTrickPrepare,
  createTideState,
  findTrickZoneAt,
  isTrickPrepareTimingValid,
  markZoneTricked,
  refreshTrickZonesForTide,
  tickTide,
  type TideState,
  type TrickPrepareState,
  type TrickZone,
} from '../world/features.js';
import type { GameArena } from '../world/maps.js';

export interface SimulationConfig {
  arena: GameArena;
  stats?: SurfboardStats;
  tickMs?: number;
}

export interface SimulationSnapshot {
  surfboard: SurfboardState;
  progression: ProgressionState;
  trickZones: TrickZone[];
  npcs: NpcDefinition[];
  boardDockX: number;
  boardDockY: number;
  boardMounted: boolean;
  tide: TideState | null;
  cursorWorldX: number | null;
  cursorWorldY: number | null;
  hoverHeading: number | null;
  clickValid: boolean;
  comboTicksRemaining: number;
  tickCount: number;
  walkTargetTx: number | null;
  walkTargetTy: number | null;
  walkClickValid: boolean;
  onFootMoving: boolean;
  trickPrepare: TrickPrepareState | null;
}

export interface XpDropEvent {
  agility: number;
  sailing: number;
  tokens: number;
  x: number;
  y: number;
}

export class GameSimulation {
  private surfboard: SurfboardState;
  private progression: ProgressionState;
  private trickZones: TrickZone[];
  private tide: TideState | null;
  private pendingInput: SurfboardInput = {};
  private stats: SurfboardStats;
  private arena: GameArena;
  readonly tickMs: number;
  private cursorWorldX: number | null = null;
  private cursorWorldY: number | null = null;
  private hoverHeading: number | null = null;
  private clickValid = true;
  private comboTicksRemaining = 0;
  private tickCount = 0;
  private xpDrops: XpDropEvent[] = [];
  private npcDialogueIndex = new Map<string, number>();
  private proximityGreeted = new Set<string>();
  private pendingDialogue: string[] = [];
  private boardMounted: boolean;
  private walk: OnFootWalkState | null = null;
  private walkClickMarker: { tx: number; ty: number; valid: boolean } | null = null;
  private pendingNpcTalk: NpcDefinition | null = null;
  private pendingBoardMount = false;
  private zoneWasSubmerged = new Map<string, boolean>();
  private trickPrepare: TrickPrepareState | null = null;
  private activeTrickZoneId: string | null = null;
  private tideFrozen = false;
  private movementFrozen = false;
  private readonly boardInteractRadius = 1.3;

  constructor(config: SimulationConfig) {
    this.arena = config.arena;
    this.boardMounted = !config.arena.requiresBoardMount;
    this.stats = config.stats ?? { ...DEFAULT_SURFBOARD_STATS };
    this.tickMs = config.tickMs ?? TICK_MS;
    this.surfboard = createSurfboard(
      config.arena.spawnX,
      config.arena.spawnY,
      config.arena.spawnHeading,
    );
    this.progression = createProgressionState();
    this.trickZones = config.arena.trickZones.map((zone) => ({ ...zone }));
    this.tide = config.arena.tide ? createTideState(config.arena.tide) : null;
  }

  getSnapshot(): SimulationSnapshot {
    return {
      surfboard: { ...this.surfboard, position: { ...this.surfboard.position } },
      progression: {
        ...this.progression,
        unlocked: new Set(this.progression.unlocked),
        session: { ...this.progression.session },
        xp: { ...this.progression.xp },
      },
      trickZones: this.trickZones.map((zone) => ({ ...zone, center: { ...zone.center } })),
      npcs: this.arena.npcs.map((npc) => ({ ...npc, dialogue: [...npc.dialogue] })),
      boardDockX: this.arena.boardDockX,
      boardDockY: this.arena.boardDockY,
      boardMounted: this.boardMounted,
      tide: this.tide ? { ...this.tide } : null,
      cursorWorldX: this.cursorWorldX,
      cursorWorldY: this.cursorWorldY,
      hoverHeading: this.hoverHeading,
      clickValid: this.clickValid,
      comboTicksRemaining: this.comboTicksRemaining,
      tickCount: this.tickCount,
      walkTargetTx: this.walkClickMarker?.tx ?? null,
      walkTargetTy: this.walkClickMarker?.ty ?? null,
      walkClickValid: this.walkClickMarker?.valid ?? true,
      onFootMoving: this.walk !== null,
      trickPrepare: this.trickPrepare ? { ...this.trickPrepare } : null,
    };
  }

  consumeXpDrops(): XpDropEvent[] {
    const drops = this.xpDrops;
    this.xpDrops = [];
    return drops;
  }

  setCursor(worldX: number, worldY: number): void {
    this.cursorWorldX = worldX;
    this.cursorWorldY = worldY;
    if (!this.boardMounted) {
      this.clickValid = true;
      this.hoverHeading = null;
      return;
    }
    const sailingTarget = this.boardMounted
      ? isWorldPointSailingTarget(this.arena.map, worldX, worldY)
      : isWorldPointNavigable(this.arena.map, worldX, worldY);
    this.clickValid = sailingTarget;
    if (this.clickValid) {
      this.hoverHeading = headingFromClick(
        this.surfboard.position.x,
        this.surfboard.position.y,
        worldX,
        worldY,
      );
    } else {
      this.hoverHeading = null;
    }
  }

  clearCursor(): void {
    this.cursorWorldX = null;
    this.cursorWorldY = null;
    this.hoverHeading = null;
    this.clickValid = true;
  }

  consumeDialogue(): string[] {
    const lines = this.pendingDialogue;
    this.pendingDialogue = [];
    return lines;
  }

  clickWorld(worldX: number, worldY: number): void {
    const tileX = Math.floor(worldX);
    const tileY = Math.floor(worldY);

    const npc =
      findNpcAt(this.arena.npcs, worldX, worldY) ?? findNpcOnTile(this.arena.npcs, tileX, tileY);
    if (npc) {
      this.handleNpcClick(npc);
      return;
    }

    if (!this.boardMounted && this.isBoardClick(tileX, tileY, worldX, worldY)) {
      this.handleBoardClick();
      return;
    }

    if (!this.boardMounted) {
      this.pendingNpcTalk = null;
      this.pendingBoardMount = false;
      this.clickToWalk(worldX, worldY);
      return;
    }

    this.clickOcean(worldX, worldY);
  }

  private handleNpcClick(npc: NpcDefinition): void {
    if (isNearNpc(npc, this.surfboard.position.x, this.surfboard.position.y)) {
      this.queueNpcDialogue(npc);
      return;
    }

    this.pendingNpcTalk = npc;
    this.pendingBoardMount = false;
    this.clickToWalk(npc.x, npc.y);
  }

  private handleBoardClick(): void {
    if (this.isNearBoard()) {
      this.tryMountBoard();
      return;
    }

    this.pendingBoardMount = true;
    this.pendingNpcTalk = null;
    this.clickToWalk(this.arena.boardDockX, this.arena.boardDockY);
  }

  private isBoardClick(tileX: number, tileY: number, worldX: number, worldY: number): boolean {
    const dockTx = Math.floor(this.arena.boardDockX);
    const dockTy = Math.floor(this.arena.boardDockY);
    if (tileX === dockTx && tileY === dockTy) {
      return true;
    }
    const dx = worldX - this.arena.boardDockX;
    const dy = worldY - this.arena.boardDockY;
    return Math.hypot(dx, dy) <= this.boardInteractRadius;
  }

  private isNearBoard(): boolean {
    const dx = this.surfboard.position.x - this.arena.boardDockX;
    const dy = this.surfboard.position.y - this.arena.boardDockY;
    return Math.hypot(dx, dy) <= this.boardInteractRadius;
  }

  private clickToWalk(worldX: number, worldY: number): void {
    const destTx = Math.floor(worldX);
    const destTy = Math.floor(worldY);
    const walk = planWalkPath(this.arena.map, this.surfboard.position, worldX, worldY);

    if (!walk) {
      this.walk = null;
      this.walkClickMarker = { tx: destTx, ty: destTy, valid: false };
      return;
    }

    this.walk = walk;
    this.walkClickMarker = { tx: destTx, ty: destTy, valid: true };
  }

  private tryMountBoard(): boolean {
    if (this.boardMounted || this.surfboard.speedState !== 'seated') {
      return false;
    }
    if (!this.isNearBoard()) {
      return false;
    }

    this.boardMounted = true;
    this.walk = null;
    this.walkClickMarker = null;
    this.pendingBoardMount = false;
    this.surfboard = {
      ...this.surfboard,
      position: { x: this.arena.boardDockX, y: this.arena.boardDockY },
      currentHeading: this.arena.spawnHeading,
      intendedHeading: this.arena.spawnHeading,
      isRotating: false,
    };
    this.pendingDialogue.push('You climb onto your surfboard.');
    return true;
  }

  clickOcean(worldX: number, worldY: number): void {
    this.setCursor(worldX, worldY);
    if (!this.clickValid || this.hoverHeading === null) {
      return;
    }
    this.pendingInput.setIntendedHeading = this.hoverHeading;
  }

  private queueNpcDialogue(npc: NpcDefinition): void {
    const index = this.npcDialogueIndex.get(npc.id) ?? 0;
    const line = npc.dialogue[index];
    if (line === undefined) {
      return;
    }
    this.pendingDialogue.push(`${npc.name}: ${line}`);
    this.npcDialogueIndex.set(npc.id, index + 1);
  }

  private checkProximityDialogue(): void {
    if (this.boardMounted && this.surfboard.speedState !== 'seated') {
      return;
    }

    const npc = findNpcNear(
      this.arena.npcs,
      this.surfboard.position.x,
      this.surfboard.position.y,
      0.6,
    );
    if (!npc || this.proximityGreeted.has(npc.id)) {
      return;
    }

    this.proximityGreeted.add(npc.id);
    this.queueNpcDialogue(npc);
  }

  private resolvePendingInteractions(): void {
    if (
      this.pendingNpcTalk &&
      isNearNpc(this.pendingNpcTalk, this.surfboard.position.x, this.surfboard.position.y)
    ) {
      this.queueNpcDialogue(this.pendingNpcTalk);
      this.pendingNpcTalk = null;
    }

    if (this.pendingBoardMount && this.isNearBoard()) {
      this.tryMountBoard();
    }
  }

  setSpeedState(state: SpeedState): void {
    if (state === 'seated') {
      this.pendingInput.stop = true;
    } else if (state === 'paddling') {
      if (!this.boardMounted) {
        if (!this.isNearBoard()) {
          this.pendingDialogue.push('Walk to your surfboard on the beach first.');
          return;
        }
        this.tryMountBoard();
      }
      if (this.boardMounted) {
        this.pendingInput.startPaddle = true;
      }
    } else if (state === 'riding') {
      if (!this.boardMounted) {
        if (!this.isNearBoard()) {
          this.pendingDialogue.push('Walk to your surfboard on the beach first.');
          return;
        }
        this.tryMountBoard();
      }
      if (!this.boardMounted) {
        return;
      }
      if (this.surfboard.speedState === 'seated') {
        this.pendingInput.startPaddle = true;
      }
      this.pendingInput.standUp = true;
    }
  }

  prepareTrick(slot: TrickPrepareSlot): void {
    if (!this.boardMounted || this.surfboard.speedState === 'seated') {
      return;
    }
    this.trickPrepare = { slot, ticksSincePrepare: 0 };
  }

  clearTrickPrepare(): void {
    this.trickPrepare = null;
  }

  private resolveTrickZoneEntry(zone: TrickZone): void {
    const prepare = this.trickPrepare;
    const timingOk =
      prepare !== null && prepare.slot === zone.prepareSlot && isTrickPrepareTimingValid(prepare);

    this.trickPrepare = null;

    if (!timingOk) {
      this.bailTrick(zone);
      return;
    }

    const comboMultiplier = Math.max(1, this.progression.session.combo);
    const result = awardTrick(this.progression, comboMultiplier);
    this.progression = result.state;
    this.trickZones = markZoneTricked(this.trickZones, zone.id);
    this.comboTicksRemaining = COMBO_TIMEOUT_TICKS;
    this.xpDrops.push({
      agility: result.xpGained.agility,
      sailing: result.xpGained.sailing,
      tokens: result.tokensGained,
      x: this.surfboard.position.x,
      y: this.surfboard.position.y,
    });
  }

  private bailTrick(zone: TrickZone, reason?: string): void {
    this.trickPrepare = null;
    this.progression = decayCombo(this.progression);
    this.activeTrickZoneId = null;
    this.surfboard = {
      ...this.surfboard,
      speedState: 'seated',
      isRotating: false,
    };
    this.pendingDialogue.push(
      reason ?? `Bailed on the ${zone.type}! Prime the trick 1–4 ticks before you hit it.`,
    );
  }

  private checkTrickZoneResolution(): void {
    if (!this.boardMounted || this.surfboard.speedState !== 'riding') {
      this.activeTrickZoneId = null;
      return;
    }

    const zone = findTrickZoneAt(this.trickZones, this.surfboard.position, this.tide);
    if (!zone) {
      this.activeTrickZoneId = null;
      return;
    }

    if (this.activeTrickZoneId === zone.id) {
      return;
    }

    this.activeTrickZoneId = zone.id;
    this.resolveTrickZoneEntry(zone);
  }

  tryPurchaseUnlock(unlockId: UnlockId): string | null {
    const outcome = purchaseUnlock(this.progression, unlockId);
    if (outcome.success) {
      this.progression = outcome.state;
      return null;
    }
    return outcome.reason ?? 'Purchase failed';
  }

  setStats(stats: Partial<SurfboardStats>): void {
    this.stats = { ...this.stats, ...stats };
  }

  setTideFrozen(frozen: boolean): void {
    this.tideFrozen = frozen;
  }

  setMovementFrozen(frozen: boolean): void {
    this.movementFrozen = frozen;
  }

  getArena(): GameArena {
    return this.arena;
  }

  tick(): void {
    if (this.boardMounted && !this.movementFrozen) {
      const result = tickSurfboard(this.surfboard, this.arena.map, this.pendingInput, this.stats);
      this.surfboard = result.state;
    } else if (this.walk) {
      const result = tickOnFootPath(
        this.surfboard.position,
        this.surfboard.currentHeading,
        this.walk,
      );
      this.walk = result.walk;
      this.surfboard = {
        ...this.surfboard,
        position: result.position,
        currentHeading: result.heading,
        intendedHeading: result.heading,
      };
      if (!result.walk) {
        this.walkClickMarker = null;
        this.resolvePendingInteractions();
      }
    }
    this.pendingInput = {};
    this.trickPrepare = advanceTrickPrepare(this.trickPrepare);
    this.checkTrickZoneResolution();

    if (this.tide && !this.tideFrozen) {
      this.tide = tickTide(this.tide);
      this.trickZones = refreshTrickZonesForTide(this.trickZones, this.tide, this.zoneWasSubmerged);
    }

    if (this.comboTicksRemaining > 0) {
      this.comboTicksRemaining -= 1;
      if (this.comboTicksRemaining === 0) {
        this.progression = decayCombo(this.progression);
      }
    }

    this.checkProximityDialogue();

    this.tickCount += 1;
  }
}
