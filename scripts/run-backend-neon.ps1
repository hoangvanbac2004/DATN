# TaskFlow Backend Launcher PowerShell Script
# Loads root .env file and executes Spring Boot Maven runner

$RootDir = Resolve-Path "$PSScriptRoot\.."
$EnvFile = "$RootDir\.env"

if (Test-Path $EnvFile) {
    Write-Host "✅ Loading environment configuration from .env..." -ForegroundColor Green
    Get-Content $EnvFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $key, $value = $line.Split("=", 2)
            $cleanValue = $value.Trim().Trim('"').Trim("'")
            [System.Environment]::SetEnvironmentVariable($key.Trim(), $cleanValue, [System.EnvironmentVariableTarget]::Process)
        }
    }
} else {
    Write-Host "⚠️ .env file not found. Using default environment variables." -ForegroundColor Yellow
}

Write-Host "🐘 Starting TaskFlow Spring Boot Backend..." -ForegroundColor Cyan
Set-Location "$RootDir\code\backend"
mvn spring-boot:run
