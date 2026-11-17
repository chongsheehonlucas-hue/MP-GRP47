@echo off
setlocal
cd /d "%~dp0"
echo ==============================================
echo       MP-GRP47 Windows Setup Launcher
 echo ==============================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup.ps1"
set "SETUP_EXIT=%ERRORLEVEL%"
echo.
if not "%SETUP_EXIT%"=="0" (
  echo Setup did not finish. Read the error above and follow SETUP_GUIDE.md.
) else (
  echo MP-GRP47 setup completed.
)
echo.
pause
exit /b %SETUP_EXIT%
