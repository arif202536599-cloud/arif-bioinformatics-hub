@echo off
setlocal
cd /d "%~dp0"
if not exist ".venv\Scripts\python.exe" (
  where py >nul 2>nul
  if not errorlevel 1 (
    py -3 -m venv .venv
  ) else (
    python -m venv .venv
  )
  if errorlevel 1 goto fail
)
if not exist ".venv\installed.txt" (
  ".venv\Scripts\python.exe" -m pip install -r requirements.txt
  if errorlevel 1 goto fail
  echo Dependencies installed> ".venv\installed.txt"
)
echo Opening the local app at http://localhost:8501
".venv\Scripts\python.exe" -m streamlit run app.py --server.address localhost --server.port 8501 --browser.gatherUsageStats false
goto end
:fail
echo Setup failed. Install Python 3.11 or newer from https://www.python.org/downloads/windows/
echo Then run START_WINDOWS.cmd again. Read the error above for details.
pause
:end
endlocal
