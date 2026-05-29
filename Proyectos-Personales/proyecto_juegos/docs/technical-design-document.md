# Technical Design Document

## Architecture

```txt
Godot Mobile Client
  -> WebSocket realtime
  -> Authoritative Game Server
  -> PostgreSQL
  -> Redis
  -> Admin/LiveOps tools
```

## Client Responsibilities

- Input capture.
- Camera.
- Animations.
- UI.
- Prediction/interpolation for smooth movement.
- Local visual effects.
- Sending player intent to the server.

The client must not own final truth for combat, currency, inventory, XP, loot, or marketplace transactions.

## Server Responsibilities

- Authentication.
- Character persistence.
- Movement validation.
- Combat resolution.
- Inventory and currency updates.
- Quest progress.
- Chat.
- Guilds.
- Matchmaking.
- Marketplace.
- Anti-cheat checks.
- Event scheduling.

## Synchronization Model

Clients send intent:

```json
{
  "input": "skill_cast",
  "skill_id": "skill_berserker_cleave",
  "target_id": "enemy_001",
  "client_time": 12345
}
```

Server sends state:

```json
{
  "type": "combat_result",
  "source_id": "player_001",
  "target_id": "enemy_001",
  "damage": 42,
  "target_hp": 58
}
```

## Mobile Performance Targets

- 30 FPS on low/mid devices.
- Optional 60 FPS on high-end devices.
- Small texture memory footprint.
- Chunked world loading.
- LODs for characters and enemies.
- Pooled combat effects.
- Minimal dynamic shadows.

