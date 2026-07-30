# Smart SAC

This repository contains a simplified Smart SAC system with a React + TypeScript frontend and an Express + MongoDB backend.

## What was prepared

- Backend configured to use local MongoDB at `mongodb://127.0.0.1:27017`
- Frontend configured to run via Vite
- Local database helper script: `backend/show-users.js`
- Admin creation flow available via API
- Git repository initialized and pushed to GitHub

## Local setup

### 1. Start MongoDB

Use PowerShell from the project root:

```powershell
cd "C:\Users\Priti\Downloads\smart-sacc-main (2)\smart-sacc-main"
mkdir -Force data
mongod --dbpath .\data --port 27017
```

If MongoDB is already running, skip this step.

### 2. Start the backend

Open a second terminal:

```powershell
cd "C:\Users\Priti\Downloads\smart-sacc-main (2)\smart-sacc-main\backend"
npm install
npm run dev
```

The backend listens on: `http://localhost:8000`

### 3. Start the frontend

Open a third terminal:

```powershell
cd "C:\Users\Priti\Downloads\smart-sacc-main (2)\smart-sacc-main\frontend"
npm install
npm run dev -- --host 0.0.0.0
```

The frontend will be available at `http://localhost:8081` (or another port if Vite moves it).

## Admin commands

### Create a new admin via API

```powershell
cd "C:\Users\Priti\Downloads\smart-sacc-main (2)\smart-sacc-main\backend"
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/api/v1/admin/register" `
  -ContentType "application/json" `
  -Body '{"email":"newadmin@example.com","password":"AdminPass123!"}'
```

- New admin email: `newadmin@example.com`
- Password must match `ADMIN_PASSWORD` in `backend/.env`

### Admin login

Open the frontend admin login page and use:

- Email: newadmin@example.com
- Password: AdminPass123!

## Inspect saved users

From `backend`:

```powershell
node --experimental-json-modules show-users.js
```

This prints the local MongoDB users stored in the `Smart-Sac` database.

## Notes

- `data/` is excluded from Git with `.gitignore`
- The local database files are stored inside the project `data/` directory
- Backend and frontend must both be running to use the app
