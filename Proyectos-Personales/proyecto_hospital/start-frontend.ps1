$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $projectRoot 'hospital-frontend'

function Get-PortOwner {
  param([int]$Port)

  $netstatLines = netstat -ano -p tcp | Select-String -Pattern "LISTENING\s+(\d+)$"
  foreach ($line in $netstatLines) {
    $parts = ($line.ToString() -replace '\s+', ' ').Trim().Split(' ')
    if ($parts.Length -lt 5) {
      continue
    }

    $localAddress = $parts[1]
    $processId = $parts[-1]
    if ($localAddress -match "[:\.]$Port$") {
      $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
      return [PSCustomObject]@{
        Port = $Port
        ProcessId = $processId
        ProcessName = if ($process) { $process.ProcessName } else { 'unknown' }
      }
    }
  }

  return $null
}

$npmCommand = $null
if (Get-Command npm.cmd -ErrorAction SilentlyContinue) {
  $npmCommand = 'npm.cmd'
} elseif (Get-Command npm -ErrorAction SilentlyContinue) {
  $npmCommand = 'npm'
} else {
  throw 'No encontre npm en el PATH.'
}

Set-Location $frontendDir

$portOwner = Get-PortOwner -Port 5173
if ($portOwner) {
  Write-Host "El puerto 5173 ya esta en uso por $($portOwner.ProcessName) (PID $($portOwner.ProcessId))."
  Write-Host 'Cierra ese proceso antes de volver a iniciar el frontend para evitar el bucle.'
  exit 1
}

Write-Host 'Iniciando frontend estable en http://127.0.0.1:5173 ...'
& $npmCommand 'run' 'dev'
