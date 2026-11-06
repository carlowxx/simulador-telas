# Instala (ou reinstala) o Simulador de Telas a partir de dist\win-unpacked, sem instalador .exe.
# Uso: npm run instalar   (depois de npm run build)
$ErrorActionPreference = 'Stop'
$root   = Split-Path -Parent $PSScriptRoot
$src    = Join-Path $root 'dist\win-unpacked'
$dest   = Join-Path $env:LOCALAPPDATA 'Programs\Simulador de Telas'
$exe    = Join-Path $dest 'Simulador de Telas.exe'

if (-not (Test-Path (Join-Path $src 'Simulador de Telas.exe'))) { throw "Build não encontrado em $src. Rode 'npm run build' antes." }

# fecha o app se estiver aberto
Get-Process -Name 'Simulador de Telas' -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Milliseconds 500

if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item -Recurse -Force (Join-Path $src '*') $dest

$shell = New-Object -ComObject WScript.Shell
foreach ($dir in @([Environment]::GetFolderPath('Desktop'), (Join-Path ([Environment]::GetFolderPath('StartMenu')) 'Programs'))) {
  $lnk = $shell.CreateShortcut((Join-Path $dir 'Simulador de Telas.lnk'))
  $lnk.TargetPath = $exe
  $lnk.WorkingDirectory = $dest
  $lnk.IconLocation = "$exe,0"
  $lnk.Description = 'Simulador de Telas'
  $lnk.Save()
}
Write-Host "Instalado em $dest (atalhos na Área de Trabalho e no Menu Iniciar)."
