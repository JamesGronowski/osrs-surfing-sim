# Ura Ura — OSRS Surfing Island Submission

## Overview

A trick-based surfing minigame built on the new sailing engine, inspired by _Tony Hawk's Pro Skater_, _Cool Boarders_, and similar arcade sports games. Players time the tides to reach a Polynesian-themed island, craft surfboards, and ride coral reefs as a local water spirit pushes waves beneath them — performing combos for **Coral Tokens** and unique rewards.

**Minigame name:** Ura Ura Swell _(open to alternatives)_

---

## Inspiration

- Trick/combo gameplay from skateboarding and snowboarding classics
- OSRS sailing's forward-momentum + steering controls, extended into a new skill activity
- A relaxed but engaging Agility method that competes with — but doesn't beat — Hallowed Sepulchre

---

## The Island — Ura Ura

Named after the Polynesian word _ura_ (red/pink), matching the island's water spirit and coral palette. Fits alongside existing island naming (e.g. Bora Bora).

### Geography & Set Dressing

- **Larger, interesting island shape** — not a tiny outcrop
- Dormant volcano covered in vegetation
- Polynesian stilt dwellings over the water
- Exposed coral ringing the island
- Ironwood trees (used by the surfing guru for board crafting)
- Palm trees and reef fishing spots

### Tidal Access

A strange tidal effect from the local water spirit causes coral on one side of the reef to dip below the water while exposing coral on the opposite side. Players must **time high tide** to sail past the reef onto the island — potentially gated behind a **sailing upgrade**.

---

## Tai'ura — The Water Spirit

|             |                                                                                     |
| ----------- | ----------------------------------------------------------------------------------- |
| **Name**    | Tai'ura (_tai_ = tides, _ura_ = pink/red)                                           |
| **Design**  | Feminine Tempoross-like spirit with pink jellyfish inside                           |
| **Role**    | Pushes surfers on waves; creates the swell for the coral park                       |
| **Visuals** | Pink spirit jellyfish (similar to Tempoross's blue spirit fish) visible when riding |

### Lore

- **Opposite force to Tempoross** — Tempoross is a gentle tide spirit; Tai'ura is wilder and more playful
- Origins and their relationship are **unknown**, but they share the same ilk
- Ancient sailors and island peoples blessed their boats with Tai'ura's favour before long journeys — stories of her saving them at sea
- Fits Gielinor's medieval fantasy tone: surfing predates the medieval period in the real world, and OSRS already has wilder concepts than reef surfing

---

## The Surfing Guru

A cool Polynesian-inspired NPC who teaches surfing lore (expandable into a quest). He grants the ability to **craft surfboards** at different tiers, gated by **Crafting level**.

---

## Surfboard & Controls

- Surfboard acts as a **1×1 micro-boat** using sailing movement (auto-forward + turn)
- Wave animation around the board changes when turning
- Player uses a **surfing stance** with trick animations on coral features
- Paddle out to low-tide coral features; Tai'ura creates a wave behind you to ride the **coral surf park**
- **Keep moving** — high tide catches up and you must advance to the next section

### Trick System

- Perform tricks on coral park features for points and combos
- **Equipment menu trick inputs** — similar to Sol Heredit's grapple attack: press different body parts to trigger tricks on different features
- Combo chains earn more Coral Tokens

### Coral Park Features

- Railings
- Tunnels
- Brain coral
- Wall rides
- Jumps

Five feature types map to three stances (Low / Medium / High), similar to Sol Heredit's body-part priming.

### Simulator prototype (this repo)

The 2D simulator implements **Coral Park** with behaviour that may differ slightly from final OSRS scope but demonstrates core loops:

| Area            | Prototype behaviour                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Reef layout     | Organic coral donut; 15 evenly spaced trick slots                                                                                       |
| Feature variety | rail, tunnel, jump, brain_coral, wall_ride — random type + depth on each tide swap                                                      |
| Tide            | Rotating submerged arc; features disabled while under the sweep                                                                         |
| Visual cycle    | Fade out on high-tide entry → fully transparent just before centre → reroll → fade in underwater → fully opaque and enabled at low tide |
| Movement        | OSRS sailing-style paddle / ride / arc turns on the reef loop                                                                           |

Technical detail: [docs/CORAL_PARK.md](docs/CORAL_PARK.md)

---

## Rewards — Coral Tokens

Earned through trick performance and combos. Trade at a reward shop (surf-themed cosmetics primary; open to useful sailing/combat items).

| Reward                 | Description                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Teeny Tai**          | Miniature wave spirit pet resembling Tai'ura, with spirit jellyfish inside. **Not purchasable** — earned through gameplay.                                                                             |
| **Tai'ura's Blessing** | Coral blessing for ship combat. Missed cannonballs return to cargo; hits grant **80% ammo recovery** (Ava's assembler-style). _Balance TBD._                                                           |
| **Ebb and Flow**       | New lunar spell. Icon: wave with pink jellyfish spirit. Cooldown; on activation, swapping weapons grants a **single boosted attack**. Tidal theme — weapon swaps mirror changing tides. _Balance TBD._ |
| **Living Coral**       | Chisel + mortar and pestle. **20% chance to double** grinding/processing output. _May exclude some items; floor drops if inventory full. Balance TBD._                                                 |

---

## Experience

- **Agility + Sailing** combo XP (primary recommendation)
- A new pure **Agility** training method — competitive but not better than Hallowed Sepulchre; potentially more relaxed and enjoyable

---

## Technical Scope

| Asset                     | Notes                                                        |
| ------------------------- | ------------------------------------------------------------ |
| Coral models + animations | Low/high tide states, park features                          |
| Player surfing stance     | Base pose + trick animations                                 |
| Surfboard                 | Micro-boat behaviour + wave VFX on turn                      |
| Island                    | Small-to-medium landmass, guru hut, ironwood, palms, fishing |
| Water spirit              | Tai'ura model + pink jellyfish particles                     |

Leverages existing sailing engine work — surfboards are boats with surf-specific animations rather than a wholly new movement system.

---

## World Fit

- Polynesian surfing culture predates medieval Europe; no anachronism issue
- Tai'ura parallels Tempoross without duplicating Fishing Guild content
- Sailing upgrade gate ties into existing sailing progression
- Tidal mechanics extend established spirit-lore patterns

---

## Open Items

- [ ] Questline with the surfing guru
- [ ] Guru NPC lore and dialogue depth
- [ ] Exact sailing upgrade requirement
- [ ] Coral Token earn rates and shop pricing
- [ ] Reward balance (Blessing, Ebb and Flow, Living Coral)
- [ ] Additional concept art / drawings from submission author

---

## Author Note

> _I'd be happy to provide more drawings of my ideas, though I'm not the strongest graphic artist. One question if this submission is selected: would the team produce concept art for picked submissions before the community poll? I'd love to give this idea the best chance if it comes to that!_
