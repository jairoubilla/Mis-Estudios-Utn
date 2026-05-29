# Aetherfall Online

MMORPG mobile open world prototype for Android and iOS.

This repository starts as a vertical slice, not a full MMO. The first target is a small online demo with one playable zone, one character class, basic combat, XP, persistence, chat, and multiplayer movement.

## Recommended Stack

- Client: Godot 4.x
- Editor: Visual Studio Code
- Backend: Nakama or Colyseus
- Database: PostgreSQL
- Cache/session: Redis
- Local services: Docker
- 3D art: Blender
- 2D art/UI: Krita
- Version control: Git + GitHub

## First Milestone

Build a playable offline prototype:

1. Character movement for mobile.
2. Third-person camera.
3. One enemy.
4. Basic attack.
5. HP and XP.
6. Save/load local progress.

After that, connect the same prototype to an authoritative multiplayer server.

## Current Prototype Controls

- Move: `WASD` or arrow keys.
- Jump: `Space`.
- Sprint: `Shift`.
- Basic attack: left mouse button or `J`.
- Rotate camera: hold right mouse button and drag.

Run it with:

```bat
launch-godot.bat
```

To quickly run the playable scene without thinking about paths:

```bat
run-game.bat
```

Current gameplay prototype:

- One controllable player.
- One dummy enemy.
- Basic melee attack.
- Reusable health component.
- XP reward when defeating the dummy enemy.
- Simple HUD for HP and XP.

## Repository Layout

```txt
client/godot/     Godot client project
server/           Backend prototype and infrastructure
docs/             Game design, technical design, economy, roadmap
art/              Source art files and references
tools/            Internal tools and balance sheets
```
