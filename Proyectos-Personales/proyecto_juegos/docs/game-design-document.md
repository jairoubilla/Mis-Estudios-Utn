# Game Design Document

## High Concept

`Aetherfall Online` is a mobile-first open-world MMORPG set in a fractured fantasy continent powered by ancient crystals. Players explore dangerous zones, join clans, clear dungeons, fight world bosses, trade crafted goods, and participate in seasonal events.

The first version must feel like a complete small MMORPG zone instead of an unfinished giant world.

## Design Pillars

- Mobile-first controls and readable combat.
- Server-authoritative online systems.
- Fair free-to-play economy.
- VIP benefits are cosmetic or quality-of-life only.
- Small polished zones before large empty maps.
- Social systems matter as much as combat.

## Playable Classes

| Class | Role | Combat Identity |
| --- | --- | --- |
| Berserker | Melee DPS / bruiser | Rage, heavy attacks, risk-reward damage |
| Swordsman | Balanced melee / light tank | Blocks, counters, precise sword skills |
| Archer | Ranged DPS / control | Mobility, traps, sustained ranged pressure |
| Mage | AoE / utility | Elements, shields, crowd control |
| Assassin | Burst DPS / mobility | Stealth, critical strikes, short combos |

Each class has male and female character models. Stats, skills, and balance remain identical between body types.

## Initial Vertical Slice

The first playable demo contains:

- One starter city.
- One forest PvE zone.
- One cave dungeon entrance.
- One enemy type.
- One elite enemy.
- One world event.
- One playable class.
- Basic inventory.
- Basic XP and level progression.
- Local save, then online persistence.

## Combat Model

Combat is action-oriented but accessible on mobile:

- Virtual joystick movement.
- Four active skills.
- Basic attack.
- Dodge with stamina cost.
- Clear area indicators for enemy attacks.
- Server validates skill range, cooldowns, damage, HP, and rewards.

## Monetization Rules

Allowed:

- Skins.
- Mount cosmetics.
- Emotes.
- Nameplates.
- Profile frames.
- Visual teleport effects.
- Outfit slots.
- Battle pass cosmetics.

Forbidden:

- Paid damage.
- Paid defense.
- Paid critical chance.
- Paid PvP advantage.
- Exclusive powerful gear.
- Premium-only superior loot.

