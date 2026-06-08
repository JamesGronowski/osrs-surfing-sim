# Ura Ura Surfing Simulator

A 2D top-down simulator for the **Ura Ura Swell** surfing minigame concept, built on OSRS-style sailing movement mechanics.

## Controls

| Action             | Input                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| Walk               | Click grass or sand — OSRS-style BFS pathing, 1 tile per tick (run)                                      |
| Talk to Kaulu      | Click the NPC on the island centre                                                                       |
| Mount board        | Walk to the sand ring and click your surfboard                                                           |
| Set heading        | Click the ocean — white arrow follows cursor, board arcs to face that direction                          |
| Paddle (slow)      | Sailing panel **Paddle** / sails icon — slow forward                                                     |
| Stand / ride swell | Sailing panel **Ride** / set sails — Tai'ura swell, full speed                                           |
| Stop               | Unset sails (fast) or chevron down — seated on board                                                     |
| Lie down           | Reverse icon — drop from riding to paddling                                                              |
| Prime trick        | **Rail** / **Tunnel** / **Jump** buttons (or keys `1`–`3`) — 1–4 ticks before hitting the matching coral |
| Land trick         | Ride through the primed feature while the timing window is active                                        |
| Bail               | Wrong button, no prime, or prime too early/late — you stop on the reef                                   |
| Debug tuning       | `1`/`!` turn rate, `2`/`@` paddle speed, `3`/`#` ride speed                                              |

### OSRS sailing mapping

| OSRS sailing                       | This simulator                          |
| ---------------------------------- | --------------------------------------- |
| Click ocean + white arrow          | Same                                    |
| Arc turn (not instant snap)        | Same — 16 directions, quarter-tile grid |
| Set / unset sails                  | Paddle / Stand / Stop                   |
| Perpetual movement while sails set | Forward while paddling or riding        |
| No smart pathfinding               | Manual steering only                    |

## Development

```bash
pnpm install
pnpm dev        # start client at http://localhost:5173
pnpm test          # engine unit tests
pnpm validate      # format, lint, test, build
pnpm playtest      # automated playthrough (walk → talk → mount → sail → trick)
pnpm playtest:update # refresh playthrough milestone screenshots
pnpm visual:test   # all Playwright tests (layout + playthrough)
pnpm visual:update # refresh all screenshot baselines
```

## Project structure

- `packages/engine` — pure TypeScript simulation (movement, collision, progression)
- `packages/client` — PixiJS renderer + OSRS-styled UI (renderer-agnostic engine output)
- `packages/client/public/assets/osrs/` — vanilla OSRS UI sprites from [melkypie/resource-packs](https://github.com/melkypie/resource-packs/tree/sample-vanilla) (see `ATTRIBUTION.md`)

The UI uses the **fixed classic layout** (765×503): 512×334 game viewport, chatbox, minimap, tab strip, and sailing options panel.

The engine is designed so a future Three.js renderer can consume the same simulation snapshots for 3D models.

## Coral Park

Round central island with Kaulu the Surf Guru, a sand-ring board dock, a wide reef loop with three spaced trick features (rail, tunnel, jump), and Tai'ura's tide that sweeps around the reef submerging coral sections.
