# Package plugin/ into an .otzplugin zip next to the bayit1 folder (and a copy in Downloads).
# Usage: powershell -ExecutionPolicy Bypass -File tools/pack.ps1
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$plugin = Join-Path $root 'plugin'
$manifest = Get-Content (Join-Path $plugin 'manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$ver = $manifest.version
$outDir = Split-Path -Parent $root
$name = "בית-ראשון-$ver.otzplugin"
$zip = Join-Path $outDir "bayit-rishon-$ver.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($plugin, $zip, [System.IO.Compression.CompressionLevel]::Optimal, $false)
$final = Join-Path $outDir $name
if (Test-Path $final) { Remove-Item $final -Force }
Move-Item $zip $final
Write-Output "packed: $final ($((Get-Item $final).Length) bytes)"
$dl = Join-Path $env:USERPROFILE "Downloads\$name"
Copy-Item $final $dl -Force
Write-Output "copied to: $dl"
