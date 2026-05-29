# Server Prototype

The first backend target is local development with Docker.

Recommended path:

1. Start with Nakama for authentication, chat, groups, storage, and realtime features.
2. Use PostgreSQL as the main persistent database.
3. Add Redis later for cache, presence, and distributed locks.
4. Keep the first version modular inside one backend before splitting services.

## Core Rule

The server is authoritative. The client sends intent; the server validates and commits results.

