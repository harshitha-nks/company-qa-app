# Company QA App

Ask domain-specific questions (like “Is redcar.io a B2B company?”) and get AI-generated answers using Groq's LLaMA 3 model — with streaming and multi-step reasoning built-in.

---

## Features

- Ask questions about companies using their domain
- Fullstack React + NestJS app
- Real-time streaming of answers
- Multi-step AI reasoning (analyze + refine)
- Question history with database (SQLite)
- Dockerized for easy deployment

---

## Local Development

### 1. Clone the repo and install dependencies

```
cd backend
npm install

cd ../frontend
npm install
```
### 2. Set your Groq API key in backend/.env

```
GROQ_API_KEY=your_groq_key_here
```

### 3. Start the servers

Terminal 1:
```
cd backend
npm run start:dev
```
Terminal 2:
```
cd frontend
npm start
```
- Frontend: http://localhost:3001

- Backend API: http://localhost:3000
---

## Running with Docker

###  1. Set your API key (edit docker-compose.yml)

```
environment:
  - GROQ_API_KEY=your_groq_api_key_here
```
### 2. Build and run
```
docker-compose up --build
```
- Frontend: http://localhost:3001

- Backend API: http://localhost:3000

---
## Deploy the App (Public Access)

You can deploy the frontend and backend publicly:

### Frontend (React) on Vercel
- Push your project to GitHub.
- Go to https://vercel.com.
- Import your repo, set the root directory to frontend/.
- Vercel will auto-detect and deploy it at https://your-app.vercel.app.

## Backend (NestJS) on Railway or Render
- Go to https://railway.app or https://render.com.
- Create a new web service from GitHub.
- Set the root to backend/, add environment variable:
```
GROQ_API_KEY=your_actual_key
```
- On Railway, backend will auto-deploy to:
```
https://your-backend.up.railway.app
````
- Finally Connect Frontend to Backend: 
In frontend/src/App.tsx, change all http://localhost:3000 to your deployed backend URL.
--- 

## Tech Stack
- Frontend: React, TypeScript, Axios
- Backend: NestJS, TypeORM, SQLite
- LLM: Groq (llama3-70b-8192) via OpenAI-compatible API
- Streaming: Server-Sent Events (SSE)
- Multi-Step Reasoning: Intent Analysis + Refined Prompting
- Docker: For full containerized deployment