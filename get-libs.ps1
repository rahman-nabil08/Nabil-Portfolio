<#
  get-libs.ps1: one-time installer for the libraries that must be downloaded.
  Run from the project folder (right-click > Run with PowerShell), or in a terminal:
      powershell -ExecutionPolicy Bypass -File .\get-libs.ps1
  Add -LocalIcons to ALSO self-host Bootstrap Icons (removes the CDN dependency):
      powershell -ExecutionPolicy Bypass -File .\get-libs.ps1 -LocalIcons
  Needs internet access. Nothing outside this project folder is touched.
#>
param([switch]$LocalIcons)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cdn  = 'https://cdn.jsdelivr.net/npm'

function Get-File($url, $dest) {
  New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
  Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
  Write-Host ("OK   " + $dest.Replace($root, '.'))
}

# ---- Slick Slider 1.8.1 (needs the jQuery you already have) ----
$slick = "$cdn/slick-carousel@1.8.1/slick"
Get-File "$slick/slick.css"        "$root\assets\css\slick.css"
Get-File "$slick/slick-theme.css"  "$root\assets\css\slick-theme.css"
Get-File "$slick/slick.min.js"     "$root\assets\js\slick.min.js"
Get-File "$slick/ajax-loader.gif"  "$root\assets\css\ajax-loader.gif"      # referenced by slick-theme.css
foreach ($f in 'slick.eot','slick.svg','slick.ttf','slick.woff') {
  Get-File "$slick/fonts/$f" "$root\assets\css\fonts\$f"                    # referenced by slick-theme.css
}

# ---- Bootstrap Icons 1.13.2 (optional self-hosting) ----
if ($LocalIcons) {
  $bi = "$cdn/bootstrap-icons@1.13.2/font"
  Get-File "$bi/bootstrap-icons.min.css"        "$root\assets\vendor\bootstrap-icons\bootstrap-icons.min.css"
  Get-File "$bi/fonts/bootstrap-icons.woff2"    "$root\assets\vendor\bootstrap-icons\fonts\bootstrap-icons.woff2"
  Get-File "$bi/fonts/bootstrap-icons.woff"     "$root\assets\vendor\bootstrap-icons\fonts\bootstrap-icons.woff"
  $old = "$cdn/bootstrap-icons@1.13.2/font/bootstrap-icons.min.css"
  $new = './assets/vendor/bootstrap-icons/bootstrap-icons.min.css'
  foreach ($page in 'index','about','portfolio','services','contact') {
    $p = "$root\$page.html"
    $t = [System.IO.File]::ReadAllText($p)
    if ($t.Contains($old)) { [System.IO.File]::WriteAllText($p, $t.Replace($old, $new)); Write-Host "OK   $page.html now uses the local icon font" }
  }
}
Write-Host "`nDone. Hard-refresh the browser (Ctrl+F5) and check the home page testimonial slider."
