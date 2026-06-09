import { describe, expect, it } from 'vitest';

import { createWorldMap, setTile } from '../world/collision.js';
import {
  createSurfboard,
  headingFromClick,
  tickSurfboard,
  type SurfboardState,
} from './surfboard.js';

describe('surfboard movement', () => {
  it('derives heading from click position', () => {
    expect(headingFromClick(0, 0, 1, 0)).toBe(0);
    expect(headingFromClick(0, 0, 0, 1)).toBe(4);
  });

  it('transitions speed states via input', () => {
    const map = createWorldMap(10, 10, 'deep_water');
    let state = createSurfboard(5, 5, 0);

    state = tickSurfboard(state, map, { startPaddle: true }).state;
    expect(state.speedState).toBe('paddling');

    state = tickSurfboard(state, map, { standUp: true }).state;
    expect(state.speedState).toBe('riding');

    state = tickSurfboard(state, map, { lieDown: true }).state;
    expect(state.speedState).toBe('paddling');

    state = tickSurfboard(state, map, { stop: true }).state;
    expect(state.speedState).toBe('seated');
  });

  it('reverses while backing up', () => {
    const map = createWorldMap(20, 20, 'deep_water');
    let state = createSurfboard(10, 10, 0);

    state = tickSurfboard(state, map, { reverse: true }).state;
    expect(state.speedState).toBe('reversing');

    const reverseStartX = state.position.x;
    state = tickSurfboard(state, map, {}).state;
    expect(state.position.x).toBeLessThan(reverseStartX);

    state = tickSurfboard(state, map, { stop: true }).state;
    expect(state.speedState).toBe('seated');
  });

  it('moves forward while paddling and arcs when turning', () => {
    const map = createWorldMap(20, 20, 'deep_water');
    let state = createSurfboard(5, 5, 0);
    state = tickSurfboard(state, map, { startPaddle: true }).state;

    const startX = state.position.x;
    state = tickSurfboard(state, map, {}).state;
    expect(state.position.x).toBeGreaterThan(startX);

    state = tickSurfboard(state, map, { setIntendedHeading: 4 }).state;
    expect(state.isRotating).toBe(true);

    const beforeTurn = { ...state.position };
    state = tickSurfboard(state, map, {}).state;
    expect(state.isRotating).toBe(true);
    expect(state.position.x).not.toBe(beforeTurn.x);
    expect(state.position.y).not.toBe(beforeTurn.y);
  });

  it('stops on collision', () => {
    const map = createWorldMap(10, 10, 'deep_water');
    setTile(map, 6, 5, 'coral_solid');

    const state: SurfboardState = {
      position: { x: 5.6, y: 5 },
      currentHeading: 0,
      intendedHeading: 0,
      speedState: 'riding',
      isRotating: false,
    };

    const result = tickSurfboard(
      state,
      map,
      {},
      {
        turnRateDegPerTick: 22.5,
        speedPaddle: 1,
        speedRide: 1,
      },
    );

    expect(result.collided).toBe(true);
    expect(result.state.speedState).toBe('riding');
    expect(result.state.position.x).toBe(5.6);
  });
});
