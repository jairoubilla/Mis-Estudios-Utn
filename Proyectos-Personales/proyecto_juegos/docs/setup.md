# Setup

## Ready

- Git is installed.
- Node.js is installed.
- Godot 4.6.2 stable was downloaded and extracted locally.
- The Godot executable is available at:

```txt
tools/godot/Godot_v4.6.2-stable_win64.exe
```

Run the project with:

```bat
launch-godot.bat
```

Run the playable prototype with:

```bat
run-game.bat
```

Current prototype controls:

- Move with `WASD` or arrow keys.
- Jump with `Space`.
- Sprint with `Shift`.
- Attack with left mouse button or `J`.
- Rotate the camera by holding right mouse button and dragging.

## Still Needed Later

Docker Desktop is needed for the backend phase, but this Windows installation does not currently have WSL installed/configured.

Recommended order:

1. Install WSL:

```bat
wsl --install
```

2. Restart Windows if requested.
3. Install Docker Desktop from the official Docker website.
4. Start the local backend:

```bat
cd server
docker compose up -d
```

## Development Order

Do not block the client prototype on Docker. Start with the Godot offline prototype first:

1. Player movement.
2. Camera.
3. Enemy dummy.
4. Basic attack.
5. HP/XP.
6. Local save.
7. Then online multiplayer.
