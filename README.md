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

## Tech Stack
- Frontend: React, TypeScript, Axios
- Backend: NestJS, TypeORM, SQLite
- LLM: Groq (llama3-70b-8192) via OpenAI-compatible API
- Streaming: Server-Sent Events (SSE)
- Multi-Step Reasoning: Intent Analysis + Refined Prompting
- Docker: For full containerized deployment