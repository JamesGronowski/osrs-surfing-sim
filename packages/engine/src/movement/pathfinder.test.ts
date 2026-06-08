import { describe, expect, it } from 'vitest';

import { createWorldMap, setTile } from '../world/collision.js';
import { findTilePath } from './pathfinder.js';

describe('findTilePath', () => {
  it('finds a straight orthogonal path', () => {
    const map = createWorldMap(5, 5, 'deep_water');
    for (let x = 0; x < 5; x += 1) {
      setTile(map, x, 2, 'grass');
    }

    const path = findTilePath(map, 0, 2, 4, 2);
    expect(path).not.toBeNull();
    expect(path!.length).toBe(5);
    expect(path![0]).toEqual({ tx: 0, ty: 2 });
    expect(path![4]).toEqual({ tx: 4, ty: 2 });
  });

  it('routes around blocked tiles', () => {
    const map = createWorldMap(5, 5, 'grass');
    setTile(map, 2, 1, 'coral_solid');
    setTile(map, 2, 2, 'coral_solid');
    setTile(map, 2, 3, 'coral_solid');

    const path = findTilePath(map, 0, 2, 4, 2);
    expect(path).not.toBeNull();
    expect(path!.some((tile) => tile.tx === 2 && tile.ty === 2)).toBe(false);
    expect(path![path!.length - 1]).toEqual({ tx: 4, ty: 2 });
  });

  it('blocks illegal diagonal corner cutting', () => {
    const map = createWorldMap(3, 3, 'grass');
    setTile(map, 1, 0, 'coral_solid');
    setTile(map, 0, 1, 'coral_solid');

    const path = findTilePath(map, 0, 0, 1, 1);
    expect(path).toBeNull();
  });
});
