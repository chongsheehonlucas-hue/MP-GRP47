# MP-GRP47 — One-click Windows Development Setup

**For teammates using Windows 10/11, PowerShell, VS Code.**  
**Project:** Digital Forensics Case Preparation & Readiness Tool  
**Stack:** React + Vite, FastAPI + Python 3.15, SQLite, Ollama with `qwen3:4b-instruct`.

## Quickest setup (recommended)

1. Clone or download your team's **MP-GRP47** GitHub repository so that you have both `frontend` and `backend` folders.
2. Extract all three files from `MP-GRP47_Windows_Setup.zip` into the **MP-GRP47 root folder** (beside `frontend` and `backend`). Don't put them inside either folder.
3. Review `setup.ps1` if desired, then **double-click `SETUP_MP-GRP47.cmd`**.
4. If software is missing, approve the prompted installation through Windows Package Manager (`winget`). The setup will:
   - Check for **Python 3.15**; install it if missing.
   - Check for a supported **Node.js and npm**; install an LTS release if missing.
   - Check for **Ollama**; install it if missing.
   - Run `npm.cmd ci` inside `frontend` to install React/Vite dependencies from `package-lock.json`.
   - Create `backend/.venv` using Python 3.15 if missing.
   - Run `pip install -r backend/requirements.txt` inside that environment.
   - Install the Ollama Python client if it isn't already present.
   - Create `backend/.env` with a strong random `SESSION_SECRET_KEY` if missing; preserve an existing nonempty key.
   - Run `ollama pull qwen3:4b-instruct` (a **~2.5 GB** download).
5. If the installer asks you to **restart VS Code or PowerShell**, close it, reopen it, and **double-click the launcher again**. Re-running the setup is supported and won't replace a valid existing session key.

**Internet access and available storage are required for first-time downloads.** These local development tools are free to use, but your computer will supply processing power and electricity. The script does **not** download or alter your team's code; it installs local prerequisites. It does not install VS Code or Git, which are optional once the project folder is available.

### Software download links (manual method)
- Python 3.15: https://www.python.org/downloads/
- Node.js: https://nodejs.org/en/download
- Ollama: https://ollama.com/download/windows
- Qwen model info: https://ollama.com/library/qwen3:4b-instruct
- Git (for cloning): https://git-scm.com/downloads
- VS Code: https://code.visualstudio.com/
- Windows Package Manager: https://learn.microsoft.com/windows/package-manager/winget/

## Start the website after installation

Open VS Code in the `MP-GRP47` repository root and use **two separate terminals**.

**Terminal 1: Backend**

```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

**Terminal 2: Frontend**

```powershell
cd frontend
npm.cmd run dev
```

Make sure Ollama is running in the background. The installer normally starts its local server, but after restarting Windows, open the Ollama app if needed.

- Chatbot test page: http://localhost:5173/chatbot.html
- Main React website: http://localhost:5173/
- FastAPI API testing: http://127.0.0.1:8000/docs

> The chatbot page will only exist if the branch/repository already includes `frontend/chatbot.html`. The installer does **not** create project pages.

## Manual installation (if the launcher cannot run)

1. Install Python 3.15, Node.js, and Ollama from the links above; reopen VS Code.
2. Open a terminal in `MP-GRP47` and run:

```powershell
# Frontend packages (React + Vite)
cd frontend
npm.cmd ci
cd ..

# Python backend environment
cd backend
py -3.15 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

# Installing Ollama
.\.venv\Scripts\python.exe -m pip install ollama
```

3. Make a local `backend/.env` with a generated session key:

```powershell
.\.venv\Scripts\python.exe -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output into `backend/.env` as `SESSION_SECRET_KEY=<generated secret>`. **Do not upload `.env` to GitHub.**

4. Downloading the AI model:

```powershell
ollama pull qwen3:4b-instruct
ollama list
```

## Troubleshooting

- **`py -3.15` isn't found:** Install Python 3.15 and restart VS Code/PowerShell. Check `py --list`.
- **`npm` / `node` isn't found:** Install Node.js and reopen your terminal.
- **`uvicorn` cannot import `main`:** Make sure you are in the `backend` folder and use the `backend/.venv` Python executable. Check the complete error traceback.
- **`SESSION_SECRET_KEY is missing`:** Check that `backend/.env` exists and contains a nonempty `SESSION_SECRET_KEY`.
- **`ollama pull` cannot connect:** Start Ollama from the Windows Start menu, or run `ollama serve` in a separate terminal, then retry.
- **`pip install` fails while building PyYAML:** Some packages lack a compatible prebuilt wheel for Python 3.15 and need Microsoft C++ Build Tools. Don't blindly edit shared `requirements.txt`; ask the project maintainer whether to install the build tools or remove unused optional dependencies.
- **`npm ci` fails with missing Rolldown native binding:** Confirm Node.js is compatible, delete `frontend/node_modules` and rerun `npm.cmd ci --include=optional`.
- **A virtual environment copied from another folder isn't working:** Delete **only** `backend/.venv`, recreate it with `py -3.15 -m venv .venv`, and reinstall packages.
- **PC performance:** The Qwen model runs locally; 16 GB RAM is a reasonable starting point, but slower systems may take longer to generate replies.

## Security and team notes

- Never commit `backend/.env`, any secret key, or real account data.
- Add `backend/.env`, `.venv/`, and `node_modules/` to `.gitignore` as appropriate.
- Do not commit any machine's `.venv` or `node_modules`.
- The `.cmd` launcher uses an **execution-policy override for its own PowerShell process only**; it does not change your PC's permanent PowerShell execution policy. Inspect the script before running it, especially if shared outside your group.
- This installs an **Ollama local development setup**, not a publicly hosted AI server. Other users need their own Ollama model or a group-hosted service to query the AI.
- The setup package was generated separately and has **not been tested on each team member's PC**. Installation success depends on network, local permissions and the current project `requirements.txt`.
