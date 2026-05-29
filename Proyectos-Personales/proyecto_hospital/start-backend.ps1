$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $projectRoot 'hospital_backend'
$venvPython = Join-Path $projectRoot '.venv\Scripts\python.exe'

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

$pythonCommand = $null
$pythonArgs = @()

if (Test-Path $venvPython) {
  $pythonCommand = $venvPython
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
  $pythonCommand = 'python'
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
  $pythonCommand = 'py'
  $pythonArgs = @('-3')
} else {
  throw 'No encontre Python ni la virtualenv del proyecto.'
}

$env:DEBUG = 'False'
$env:FLASK_DEBUG = '0'

Set-Location $backendDir

$portOwner = Get-PortOwner -Port 5000
if ($portOwner) {
  Write-Host "El puerto 5000 ya esta en uso por $($portOwner.ProcessName) (PID $($portOwner.ProcessId))."
  Write-Host 'Cierra ese proceso antes de volver a iniciar el backend para evitar el bucle.'
  exit 1
}

Write-Host 'Iniciando backend estable en http://127.0.0.1:5000 ...'
& $pythonCommand @pythonArgs 'app.py'
