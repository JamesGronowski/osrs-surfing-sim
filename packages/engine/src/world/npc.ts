export interface NpcDefinition {
  id: string;
  name: string;
  x: number;
  y: number;
  interactRadius: number;
  dialogue: string[];
}

export function findNpcAt(
  npcs: NpcDefinition[],
  worldX: number,
  worldY: number,
): NpcDefinition | null {
  for (const npc of npcs) {
    const dx = worldX - npc.x;
    const dy = worldY - npc.y;
    if (Math.hypot(dx, dy) <= npc.interactRadius) {
      return npc;
    }
  }
  return null;
}

export function findNpcOnTile(
  npcs: NpcDefinition[],
  tileX: number,
  tileY: number,
): NpcDefinition | null {
  for (const npc of npcs) {
    if (Math.floor(npc.x) === tileX && Math.floor(npc.y) === tileY) {
      return npc;
    }
  }
  return null;
}

export function findNpcNear(
  npcs: NpcDefinition[],
  worldX: number,
  worldY: number,
  extraRadius = 0,
): NpcDefinition | null {
  for (const npc of npcs) {
    const dx = worldX - npc.x;
    const dy = worldY - npc.y;
    if (Math.hypot(dx, dy) <= npc.interactRadius + extraRadius) {
      return npc;
    }
  }
  return null;
}

export function isNearNpc(
  npc: NpcDefinition,
  worldX: number,
  worldY: number,
  extraRadius = 0.3,
): boolean {
  const dx = worldX - npc.x;
  const dy = worldY - npc.y;
  return Math.hypot(dx, dy) <= npc.interactRadius + extraRadius;
}
