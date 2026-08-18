# Smart SAC

This repository contains a Smart SAC web application with a React + TypeScript frontend and an Express + MongoDB backend.

## Features

- Backend server can be started locally.
- Frontend can be started locally with Vite.
- MongoDB connection is configured and data can be stored locally.
- Student and admin route structure is implemented.
- User and admin models are defined.
- User registration data is stored in MongoDB.
- Password hashing is implemented using bcrypt.
- Basic UI pages and route-based navigation are present.
- The project has been pushed to GitHub.

## Project structure

### Backend

The backend is built with Node.js, Express, and MongoDB.

Main folders:

- `backend/src/` — main backend source code
- `backend/src/controllers/` — request handlers for users and admins
- `backend/src/models/` — MongoDB schemas for users, admins, equipment, tickets, games, announcements, and messages
- `backend/src/routes/` — API routes for users and admins
- `backend/src/middlewares/` — JWT authentication middleware
- `backend/src/db/` — MongoDB connection setup

### Frontend

The frontend is built with React, TypeScript, and Vite.

Main folders:

- `frontend/src/pages/` — login, registration, dashboard, profile, and admin pages
- `frontend/src/components/` — reusable UI components
- `frontend/src/context/` — authentication context
- `frontend/src/lib/` — API helper for backend communication

## Local setup

### 1. Start MongoDB

From the project root:

```powershell
cd "C:\Users\Priti\Downloads\smart-sacc-main (2)\smart-sacc-main"
mkdir -Force data
mongod --dbpath .\data --port 27017
```

### 2. Start the backend

```powershell
cd "C:\Users\Priti\Downloads\smart-sacc-main (2)\smart-sacc-main\backend"
npm install
npm run dev
```

Backend URL:

- `http://localhost:8000`

### 3. Start the frontend

```powershell
cd "C:\Users\Priti\Downloads\smart-sacc-main (2)\smart-sacc-main\frontend"
npm install
npm run dev -- --host 0.0.0.0
```

Frontend URL:

- `http://localhost:8081` or another Vite-assigned port

## How the current system works

### Student flow

- A student can fill the registration form.
- The backend receives the data.
- The data is validated and stored in MongoDB.
- Passwords are hashed before saving.

### Admin flow

- Admin registration and login logic are available.
- Admin authentication endpoints are implemented.

### Database

- User data and other project records are stored locally in MongoDB.
- A helper file is available to inspect stored users.

## Useful command

To inspect saved users from the backend folder:

```powershell
node --experimental-json-modules show-users.js
```

## Notes

- The `data/` folder is excluded from Git.
- The project is intended as a local development project.
