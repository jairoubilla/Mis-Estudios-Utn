@echo off
set GODOT_EXE=tools\godot\Godot_v4.6.2-stable_win64.exe

if not exist "%GODOT_EXE%" (
  echo Godot was not found at %GODOT_EXE%.
  echo Run launch-godot.bat after Godot is downloaded and extracted.
  exit /b 1
)

start "" "%GODOT_EXE%" --path client\godot --resolution 1280x720
