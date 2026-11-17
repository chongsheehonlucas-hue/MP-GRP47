

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Model = 'qwen3:4b-instruct'

function Show-Step([string]$Message) {
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Refresh-Path {
    $machinePath = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
    $env:Path = "$machinePath;$userPath"
}

function Command-Exists([string]$Name) {
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Install-WithWinget([string]$Name, [string]$PackageId, [string]$DownloadUrl) {
    if (-not (Command-Exists 'winget')) {
        throw "Windows Package Manager (winget) is unavailable. Install $Name manually from $DownloadUrl, reopen PowerShell, and rerun setup."
    }

    Write-Host "$Name is missing or has an unsupported version."
    $choice = Read-Host "Install $Name using winget? [Y/n]"
    if ($choice -match '^[Nn]') {
        throw "Install $Name from $DownloadUrl, then rerun this setup."
    }

    & winget install --id $PackageId --exact --accept-package-agreements --accept-source-agreements
    if ($LASTEXITCODE -ne 0) {
        throw "winget could not install $Name. Install it manually from $DownloadUrl, then rerun setup."
    }
    Refresh-Path
}

function Has-Python315 {
    if (-not (Command-Exists 'py')) { return $false }
    try {
        $result = & py -3.15 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")' 2>$null
        return ($LASTEXITCODE -eq 0 -and "$result".Trim() -eq '3.15')
    } catch {
        return $false
    }
}

function Has-CompatibleNode {
    if (-not (Command-Exists 'node')) { return $false }
    try {
        $rawVersion = & node --version 2>$null
        if ($LASTEXITCODE -ne 0 -or $rawVersion -notmatch '^v(\d+)\.(\d+)\.') { return $false }
        $major = [int]$Matches[1]
        $minor = [int]$Matches[2]
        return ($major -ge 24 -or ($major -eq 22 -and $minor -ge 12) -or ($major -eq 20 -and $minor -ge 19))
    } catch {
        return $false
    }
}

function Get-OllamaCommand {
    $command = Get-Command 'ollama' -ErrorAction SilentlyContinue
    if ($command) { return $command.Source }
    $candidates = @(
        (Join-Path $env:LOCALAPPDATA 'Programs\Ollama\ollama.exe'),
        (Join-Path $env:ProgramFiles 'Ollama\ollama.exe')
    )
    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) { return $candidate }
    }
    return $null
}

function Ensure-OllamaServer([string]$OllamaExe) {
    try {
        $null = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 2
        return
    } catch { }

    Write-Host 'Starting local Ollama server...'
    try {
        Start-Process -FilePath $OllamaExe -ArgumentList 'serve' -WindowStyle Hidden | Out-Null
    } catch {
        throw 'Could not start Ollama. Open the Ollama app from the Start menu and rerun setup.'
    }
    for ($i = 0; $i -lt 10; $i++) {
        Start-Sleep -Seconds 2
        try {
            $null = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 2
            return
        } catch { }
    }
    throw 'Ollama did not start. Open the Ollama app, check http://localhost:11434, and rerun setup.'
}

try {
    Write-Host 'MP-GRP47 | React + FastAPI + Ollama setup' -ForegroundColor Green
    Write-Host 'This installs software/dependencies from their official package sources.'
    Write-Host 'Software installers may ask for Windows permission.'

    if (-not (Test-Path (Join-Path $Root 'frontend\package.json'))) {
        throw 'Missing frontend/package.json. Unzip these setup files into the MP-GRP47 repository ROOT (beside frontend/ and backend/).'
    }
    if (-not (Test-Path (Join-Path $Root 'frontend\package-lock.json'))) {
        throw 'Missing frontend/package-lock.json. Ask the group to commit its lockfile, then rerun setup.'
    }
    if (-not (Test-Path (Join-Path $Root 'backend\requirements.txt'))) {
        throw 'Missing backend/requirements.txt. Place the setup files in the correct repository root.'
    }

    Show-Step '1/6: Check Python 3.15'
    if (-not (Has-Python315)) {
        Install-WithWinget 'Python 3.15' 'Python.Python.3.15' 'https://www.python.org/downloads/'
    }
    if (-not (Has-Python315)) {
        throw 'Python 3.15 is not yet detectable. Close and reopen VS Code/PowerShell, then rerun this setup.'
    }
    & py -3.15 --version

    Show-Step '2/6: Check Node.js and npm'
    if (-not (Has-CompatibleNode)) {
        Install-WithWinget 'Node.js LTS' 'OpenJS.NodeJS.LTS' 'https://nodejs.org/en/download'
    }
    if (-not (Has-CompatibleNode) -or -not (Command-Exists 'npm.cmd')) {
        throw 'Node.js/npm are not yet detectable or meet no supported version. Restart VS Code/PowerShell and rerun setup.'
    }
    & node --version
    & npm.cmd --version

    Show-Step '3/6: Check Ollama'
    $ollamaExe = Get-OllamaCommand
    if (-not $ollamaExe) {
        Install-WithWinget 'Ollama' 'Ollama.Ollama' 'https://ollama.com/download/windows'
        $ollamaExe = Get-OllamaCommand
    }
    if (-not $ollamaExe) {
        throw 'Ollama is installed but the executable is not yet detected. Restart PowerShell and rerun setup.'
    }
    & $ollamaExe --version

    Show-Step '4/6: Install frontend dependencies (npm ci)'
    Push-Location (Join-Path $Root 'frontend')
    try {
        & npm.cmd ci
        if ($LASTEXITCODE -ne 0) { throw 'npm ci failed. See the output above for the failing frontend package.' }
    } finally {
        Pop-Location
    }

    Show-Step '5/6: Set up Python 3.15 environment and backend dependencies'
    $backend = Join-Path $Root 'backend'
    $venvPython = Join-Path $backend '.venv\Scripts\python.exe'
    if (-not (Test-Path $venvPython)) {
        & py -3.15 -m venv (Join-Path $backend '.venv')
        if ($LASTEXITCODE -ne 0) { throw 'Could not create backend/.venv.' }
    }
    $venvVersion = & $venvPython -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")'
    if ($LASTEXITCODE -ne 0 -or "$venvVersion".Trim() -ne '3.15') {
        throw 'Existing backend/.venv is broken or uses another Python version. Delete backend/.venv (only), then rerun setup.'
    }
    & $venvPython -m pip install -r (Join-Path $backend 'requirements.txt')
    if ($LASTEXITCODE -ne 0) {
        throw 'Python package installation failed. See error above. If PyYAML requires C++ Build Tools, consult SETUP_GUIDE.md.'
    }
    # Existing projects may not yet list ollama in requirements.txt.
    & $venvPython -c 'import ollama'
    if ($LASTEXITCODE -ne 0) {
        Write-Host 'The Ollama Python client was absent. Installing it now...'
        & $venvPython -m pip install ollama
        if ($LASTEXITCODE -ne 0) { throw 'Could not install the Ollama Python client.' }
        Write-Warning 'Add ollama to backend/requirements.txt and commit that change so the whole group stays in sync.'
    }

    $envFile = Join-Path $backend '.env'
    $needsSecret = $true
    if (Test-Path $envFile) {
        $existingLines = @(Get-Content $envFile)
        foreach ($line in $existingLines) {
            if ($line -match '^\s*SESSION_SECRET_KEY\s*=\s*\S+') { $needsSecret = $false }
        }
    }
    if ($needsSecret) {
        $secret = (& $venvPython -c 'import secrets; print(secrets.token_urlsafe(32))').Trim()
        if ($LASTEXITCODE -ne 0 -or -not $secret) { throw 'Could not generate session secret.' }
        if (Test-Path $envFile) {
            $filteredLines = @(Get-Content $envFile | Where-Object { $_ -notmatch '^\s*SESSION_SECRET_KEY\s*=' })
            [System.IO.File]::WriteAllText($envFile, (($filteredLines -join "`r`n") + $(if ($filteredLines.Count -gt 0) { "`r`n" } else { '' }) + "SESSION_SECRET_KEY=$secret`r`n"))
        } else {
            [System.IO.File]::WriteAllText($envFile, "SESSION_SECRET_KEY=$secret`r`n")
        }
        Write-Host 'Created local backend/.env with a random session secret (not printed).'
    } else {
        Write-Host 'Existing SESSION_SECRET_KEY was preserved.'
    }
    if (Command-Exists 'git') {
        Push-Location $Root
        try {
            & git check-ignore -q backend/.env 2>$null
            if ($LASTEXITCODE -ne 0) {
                Write-Warning 'backend/.env might not be ignored by Git. Add backend/.env to .gitignore before any commit.'
            }
        } finally { Pop-Location }
    } else {
        Write-Warning 'Keep backend/.env out of GitHub.'
    }

    Show-Step '6/6: Download Qwen model (about 2.5 GB)'
    Ensure-OllamaServer $ollamaExe
    & $ollamaExe pull $Model
    if ($LASTEXITCODE -ne 0) { throw "Could not download $Model. Check internet/disk space and rerun setup." }

    Write-Host "`n==============================================" -ForegroundColor Green
    Write-Host 'SETUP COMPLETE' -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host 'Start the backend in a NEW terminal:'
    Write-Host '  cd backend'
    Write-Host '  .\.venv\Scripts\python.exe -m uvicorn main:app --reload'
    Write-Host 'Start the frontend in another terminal:'
    Write-Host '  cd frontend'
    Write-Host '  npm.cmd run dev'
    Write-Host 'Chatbot page (development): http://localhost:5173/chatbot.html'
    Write-Host 'Swagger API docs: http://127.0.0.1:8000/docs'
    Write-Host 'Ollama must stay running locally to answer chatbot requests.'
} catch {
    Write-Host "`nSETUP FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
exit 0
