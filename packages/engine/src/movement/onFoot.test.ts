import { describe, expect, it } from 'vitest';

import { createWorldMap, setTile } from '../world/collision.js';
import { planWalkPath, tickOnFootPath } from './onFoot.js';

describe('on-foot movement', () => {
  it('moves one tile per tick when running', () => {
    const map = createWorldMap(5, 5, 'grass');
    const walk = planWalkPath(map, { x: 0.5, y: 2.5 }, 2, 2);
    expect(walk).not.toBeNull();

    const first = tickOnFootPath({ x: 0.5, y: 2.5 }, 0, walk!);
    expect(first.moved).toBe(true);
    expect(first.position).toEqual({ x: 1.5, y: 2.5 });

    const second = tickOnFootPath(first.position, first.heading, first.walk!);
    expect(second.position).toEqual({ x: 2.5, y: 2.5 });
    expect(second.walk).toBeNull();
  });

  it('returns null when destination is not walkable', () => {
    const map = createWorldMap(3, 3, 'deep_water');
    setTile(map, 1, 1, 'grass');
    const walk = planWalkPath(map, { x: 1.5, y: 1.5 }, 0, 0);
    expect(walk).toBeNull();
  });
});
