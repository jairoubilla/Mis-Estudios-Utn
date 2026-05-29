$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$shellPath = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'

$backendScript = Join-Path $projectRoot 'start-backend.ps1'
$frontendScript = Join-Path $projectRoot 'start-frontend.ps1'

Write-Host 'Abriendo backend y frontend en consolas separadas...'

Start-Process -FilePath $shellPath -WorkingDirectory $projectRoot -ArgumentList @(
  '-NoProfile',
  '-NoExit',
  '-ExecutionPolicy', 'Bypass',
  '-File', $backendScript
) | Out-Null

Start-Sleep -Seconds 2

Start-Process -FilePath $shellPath -WorkingDirectory $projectRoot -ArgumentList @(
  '-NoProfile',
  '-NoExit',
  '-ExecutionPolicy', 'Bypass',
  '-File', $frontendScript
) | Out-Null

Write-Host 'Listo. Usa start-dev.ps1 para evitar el bucle de reinicios en una sola terminal.'
