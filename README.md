# MP-GRP47
Our prototype for website for Major Project task titled: Digital Forensics Case Preparation &amp; Readiness Tool Objective

# Run before starting work
HI GUYS
These are the prerequisite packages try to install before running the website!
Node.js v24.22.1-x64 LTS -> https://nodejs.org/en/download
Python 26.4 -> https://www.python.org/downloads 

run these commands for the first time if you havent:
cd frontend
Run in terminal --> npm.cmd ci


# Whenever you want to start the website , run this
cd frontend
npm.cmd run dev
OR
npm run dev
(difference in .cmd just depends what CLI your vsc is using)

need to run 'cd frontend' as the npm packages are stored in the frontend folder

# UPDATE NOTES (A section to update you guys on the general structure of the website)

10/28 - frontend structure has been generate with react.js and npm packages, have yet to install backend with fastapi + python backend

10/30 - hosting backend '.\.venv\Scripts\python.exe -m uvicorn main:app --reload'