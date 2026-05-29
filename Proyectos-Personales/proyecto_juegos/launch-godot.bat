@echo off
set GODOT_EXE=tools\godot\Godot_v4.6.2-stable_win64.exe

if not exist "%GODOT_EXE%" (
  echo Godot was not found at %GODOT_EXE%.
  echo Download or extract Godot before running this launcher.
  exit /b 1
)

start "" "%GODOT_EXE%" --path client\godot

