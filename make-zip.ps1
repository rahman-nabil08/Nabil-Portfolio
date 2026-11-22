<#
  make-zip.ps1: builds the portfolio ZIP on your Desktop, then verifies it.
  Run from the project folder:
      powershell -ExecutionPolicy Bypass -File .\make-zip.ps1
  Output: <Desktop>\Nabil-Rahman-Portfolio-Website.zip
  It only READS your project files; nothing in the project folder is changed or deleted.
#>
param([string]$OutName = 'Nabil-Rahman-Portfolio-Website.zip')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root    = Split-Path -Parent $MyInvocation.MyCommand.Path
$zipPath = Join-Path ([Environment]::GetFolderPath('Desktop')) $OutName
Write-Host "Project : $root"
Write-Host "ZIP     : $zipPath`n"

# ---- 1. all five pages must exist ----
$pages = 'index.html','about.html','portfolio.html','services.html','contact.html'
$missingPages = $pages | Where-Object { -not (Test-Path (Join-Path $root $_)) }
if ($missingPages) { throw "Missing page(s): $($missingPages -join ', '). ZIP not created." }
Write-Host "[OK] All 5 HTML pages exist"

# ---- 2. every local file referenced by the pages must exist ----
$missingRefs = @()
foreach ($p in $pages) {
  $t = [System.IO.File]::ReadAllText((Join-Path $root $p))
  foreach ($m in [regex]::Matches($t, '(?:src|href|content)="\.?/?(assets/[^"?#]+)"')) {
    $rel = [Uri]::UnescapeDataString($m.Groups[1].Value).Replace('/', '\')
    if (-not (Test-Path (Join-Path $root $rel))) { $missingRefs += $rel }
  }
}
$missingRefs = $missingRefs | Sort-Object -Unique
if ($missingRefs) {
  Write-Host "[!!] Referenced files that do NOT exist yet (run get-libs.ps1 to install):" -ForegroundColor Yellow
  $missingRefs | ForEach-Object { Write-Host "       $_" -ForegroundColor Yellow }
} else { Write-Host "[OK] Every referenced CSS/JS/image file exists" }

# ---- 3. collect files (skip junk, caches, the zip itself) ----
$skipDir  = '\.git\', '\node_modules\', '\.vscode\', '\.idea\', '\__MACOSX\'
$skipName = 'Thumbs.db', 'desktop.ini', '.DS_Store'
$files = Get-ChildItem -LiteralPath $root -Recurse -File -Force | Where-Object {
  $full = $_.FullName
  $okDir = -not ($skipDir | Where-Object { $full.Contains($_) })
  $okDir -and ($skipName -notcontains $_.Name) -and ($_.Extension -notin '.tmp', '.log', '.bak') -and ($full -ne $zipPath)
}

# ---- 4. create the archive (relative paths preserved, forward slashes) ----
if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
try {
  foreach ($f in $files) {
    $rel = $f.FullName.Substring($root.Length + 1).Replace('\', '/')
    [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $f.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal)
  }
} finally { $zip.Dispose() }

# ---- 5. verify by re-opening the archive ----
$z = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
  $names = $z.Entries | ForEach-Object { $_.FullName }
  $count = $names.Count
} finally { $z.Dispose() }
if ($count -ne $files.Count) { throw "Verification failed: archive has $count entries, expected $($files.Count)." }
$pagesIn = $pages | Where-Object { $names -contains $_ }
$imgs    = ($names | Where-Object { $_ -like 'assets/images/*' }).Count
$libs    = 'assets/css/bootstrap.min.css','assets/js/bootstrap.bundle.min.js','assets/js/jquery-3.7.1.min.js',
           'assets/css/slick.css','assets/css/slick-theme.css','assets/js/slick.min.js',
           'assets/vendor/bootstrap-icons/bootstrap-icons.min.css'

Write-Host "`n===== ZIP VERIFIED =====" -ForegroundColor Green
Write-Host "Location     : $zipPath"
Write-Host ("Size         : {0:N1} MB" -f ((Get-Item -LiteralPath $zipPath).Length / 1MB))
Write-Host "Files        : $count"
Write-Host "HTML pages   : $($pagesIn.Count) of 5"
Write-Host "Images       : $imgs (assets/images)"
foreach ($l in $libs) { Write-Host ("{0,-9}: {1}" -f ($(if ($names -contains $l) { 'included' } else { 'MISSING' })), $l) }
Write-Host "`n(bootstrap-icons is optional: pages use the CDN unless get-libs.ps1 -LocalIcons was run.)"
