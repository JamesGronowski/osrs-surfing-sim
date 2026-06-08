# Ura Ura Surfing Simulator

A 3D web simulator for the **Ura Ura Swell** surfing minigame concept, built on OSRS-style sailing movement mechanics.

## Controls

| Action             | Input                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| Walk               | Click grass or sand — OSRS-style BFS pathing, 1 tile per tick (run)                                            |
| Talk to Kaulu      | Click the NPC on the island centre                                                                             |
| Mount board        | Walk to the sand ring and click your surfboard                                                                 |
| Set heading        | Click the ocean — white arrow follows cursor, board arcs to face that direction                                |
| Paddle (slow)      | Sailing panel **Paddle** / sails icon — slow forward                                                           |
| Stand / ride swell | Sailing panel **Ride** / set sails — Tai'ura swell, full speed                                                 |
| Stop               | Unset sails (fast) or chevron down — seated on board                                                           |
| Lie down           | Reverse icon — drop from riding to paddling                                                                    |
| Prime trick        | **Low** / **Medium** / **High** stance buttons (or keys `1`–`3`) — 1–4 ticks before hitting the matching coral |
| Land trick         | Ride through the primed feature while the timing window is active                                              |
| Bail               | Wrong button, no prime, or prime too early/late — you stop on the reef                                         |
| Debug tuning       | `1`/`!` turn rate, `2`/`@` paddle speed, `3`/`#` ride speed                                                    |

### Trick stance mapping

Five coral feature types map to three stances:

| Stance       | Features          |
| ------------ | ----------------- |
| Low (`1`)    | rail, brain coral |
| Medium (`2`) | tunnel, wall ride |
| High (`3`)   | jump              |

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
pnpm dev             # start client at http://localhost:5173
pnpm test            # engine unit tests
pnpm validate        # format, lint, test, build
pnpm playtest        # automated playthrough (walk → talk → mount → sail → trick)
pnpm playtest:update # refresh playthrough milestone screenshots
pnpm visual:test     # all Playwright tests (layout + playthrough)
pnpm visual:update   # refresh all screenshot baselines
```

## Project structure

- `packages/engine` — pure TypeScript simulation (movement, collision, tide, trick zones)
- `packages/client` — Three.js 3D viewport + OSRS-styled UI (renderer-agnostic engine output)
- `packages/client/public/assets/osrs/` — vanilla OSRS UI sprites from [melkypie/resource-packs](https://github.com/melkypie/resource-packs/tree/sample-vanilla) (see `ATTRIBUTION.md`)
- `docs/CORAL_PARK.md` — tide cycle, feature placement, and engine file reference

The UI uses the **fixed classic layout** (765×503): 512×334 game viewport, chatbox, minimap, tab strip, and sailing options panel.

The engine is designed so a future Three.js renderer can consume the same simulation snapshots for 3D models.

## Coral Park

Round central island with **Kaulu the Surf Guru**, a sand-ring board dock, and a wide **coral reef loop** around the island.

- **15 trick features** evenly spaced around the reef; type and radial position re-roll when Tai'ura's tide passes.
- **Tai'ura's tide** — a rotating high-tide band sweeps clockwise around the reef. Features fade out as tide arrives, swap to a new random feature underwater, then fade in and become rideable at low tide.
- Ride **clockwise** around the island; yellow chevrons mark approach direction per feature.

See [docs/CORAL_PARK.md](docs/CORAL_PARK.md) for tide phase timing, spawn rules, and where to edit behaviour.

## GitHub Pages

Pushes to `main` build the client and deploy to the `gh-pages` branch.

One-time setup in the repo on GitHub:

1. **Settings → Actions → General → Workflow permissions** — select **Read and write permissions**
2. **Settings → Pages → Build and deployment** — Source: **Deploy from a branch**, Branch: **`gh-pages`** / **`/ (root)`**

Live site: https://staysleeping.github.io/osrs-surfing-sim/

## License

Original code in this repository is licensed under the [MIT License](LICENSE).

OSRS UI sprites are from [melkypie/resource-packs](https://github.com/melkypie/resource-packs) (BSD-2-Clause). See [ATTRIBUTION.md](packages/client/public/assets/osrs/ATTRIBUTION.md).

This is an unofficial fan project. Old School RuneScape and related trademarks are © Jagex Ltd. Not affiliated with or endorsed by Jagex.
