# Instala o Simulador de Telas em qualquer PC com Windows, direto da última versão do GitHub.
# Uso (PowerShell):
#   irm https://raw.githubusercontent.com/carlowxx/simulador-telas/main/scripts/instalar-online.ps1 | iex
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$repo = 'carlowxx/simulador-telas'
$dest = Join-Path $env:LOCALAPPDATA 'Programs\Simulador de Telas'
$exe  = Join-Path $dest 'Simulador de Telas.exe'

Write-Host 'Procurando a versão mais recente...'
$rel = Invoke-RestMethod "https://api.github.com/repos/$repo/releases/latest" -Headers @{ 'User-Agent' = 'simulador-telas' }
$zip = $rel.assets | Where-Object { $_.name -like '*-win.zip' } | Select-Object -First 1
if (-not $zip) { throw 'Não encontrei o arquivo .zip na última versão.' }

$tmp = Join-Path $env:TEMP "simulador-telas-$([guid]::NewGuid().ToString('N'))"
New-Item -ItemType Directory -Force $tmp | Out-Null
$zipPath = Join-Path $tmp $zip.name
Write-Host "Baixando $($zip.name) ($([math]::Round($zip.size / 1MB)) MB)..."
Invoke-WebRequest $zip.browser_download_url -OutFile $zipPath -Headers @{ 'User-Agent' = 'simulador-telas' }

Get-Process -Name 'Simulador de Telas' -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Milliseconds 500
if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
New-Item -ItemType Directory -Force $dest | Out-Null
Write-Host 'Instalando...'
Expand-Archive -Path $zipPath -DestinationPath $dest -Force
Get-ChildItem -Recurse $dest | Unblock-File -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $tmp

$shell = New-Object -ComObject WScript.Shell
foreach ($dir in @([Environment]::GetFolderPath('Desktop'), (Join-Path ([Environment]::GetFolderPath('StartMenu')) 'Programs'))) {
  $lnk = $shell.CreateShortcut((Join-Path $dir 'Simulador de Telas.lnk'))
  $lnk.TargetPath = $exe; $lnk.WorkingDirectory = $dest; $lnk.IconLocation = "$exe,0"; $lnk.Description = 'Simulador de Telas'
  $lnk.Save()
}
Write-Host "Pronto! Simulador de Telas $($rel.tag_name) instalado. Atalho criado na Área de Trabalho." -ForegroundColor Green
Start-Process $exe
