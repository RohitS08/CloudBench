# 🌩️ CloudBench

> Real-time, containerized terminal sessions in your browser — powered by Docker, xterm.js, Socket.IO, and Traefik.

![Docker](https://img.shields.io/badge/docker-ready-blue?logo=docker)
![Socket.IO](https://img.shields.io/badge/socket.io-live%20communication-black?logo=socket.io)
![Node.js](https://img.shields.io/badge/node.js-server-green?logo=node.js)
![React](https://img.shields.io/badge/react-frontend-61DAFB?logo=react)
![License](https://img.shields.io/github/license/RohitS08/CloudBench)

---

## 🧠 Overview

**CloudBench** is a cloud-native terminal platform that enables users to launch isolated, Docker-powered sessions right from the browser. Each session provides a real-time interactive shell (Node.js, Python, Linux) and can expose apps via routed subdomains — making it ideal for development, sandboxing, and live app demos.

---

## 🚀 Features

- ⚡ Real-time terminal (xterm.js + Socket.IO)
- 🐳 Isolated Docker containers per session
- 🔐 JWT-based user authentication
- 🎛️ Session controls: Start, Pause, Resume, Delete
- 🌐 Traefik-based subdomain routing (`*.terminal.yourdomain.com`)
- 📊 MongoDB for session metadata
- 📦 Scalable architecture: frontend, backend API, container manager

---

## 🧱 Architecture

```text
Frontend (React + xterm.js)
        │
   Socket.IO (real-time)
        │
Backend API (Node.js) ──── Auth, MongoDB
        │
   Socket.IO (session control)
        │
Docker Server (Node.js) ─── Dockerode-based container control, Traefik routing
        │
    Docker + Traefik
```

# 🛠️ Getting Started
1. Clone the repo
```
git clone https://github.com/RohitS08/CloudBench.git
cd CloudBench
```

2. Set Environment variables for frontend, backend & docker_server.

3. Start supporting services
Make sure Docker is running, then start MongoDB, and Traefik using Docker Compose:
`docker-compose up -d` inside docker_server/traefik

4. Start the services
  # Backend API
  ```
  cd backend
  npm install
  npm run start
  ```
  
  # Docker Server
  ```
  cd docker_server
  npm install
  npm run start
  ```
  
  # Frontend
  ```
  cd frontend
  npm install
  npm run dev
  ```
## 🧪 Tech Stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| 💠 Frontend       | React, Vite, xterm.js               |
| 💠 Backend API    | Node.js, Express, MongoDB    |
| 💠 Container Server | Node.js, Dockerode                |
| 💠 Routing        | Traefik (dynamic subdomain)         |
| 💠 Auth           | JWT                                 |

## 🌍 Usage Flow

- 👉 User signs up / logs in (JWT issued)  
- 👉 User creates a terminal session (Node.js, Python, Alpine, etc.)  
- 👉 Backend requests Docker Server → container is created  
- 👉 Terminal UI connects in real time using xterm.js + Socket.IO  
- 👉 User runs commands or apps (e.g., `npm run dev`)  
- 👉 Apps are routed via Traefik (`user123.terminal.domain.com`)  
- 👉 Session can be paused, resumed, or deleted from the dashboard  

## 📸 Screenshots

### 🏠 Home Page  
![CloudBench_HomePage](https://github.com/user-attachments/assets/ed377053-25b1-4040-b40f-423491cdbb59)
---
### 🔐 Login  
![CloudBench_Login](https://github.com/user-attachments/assets/4a01f457-0429-43e9-8076-b952ca92c1fe)
---
### 📊 Dashboard  
![CloudBench_Dashboard](https://github.com/user-attachments/assets/6c2c9340-17f0-496e-b9bd-b0aa2123fbc3)
---
### ➕ Create New Session  
![CloudBench_CreateSession](https://github.com/user-attachments/assets/45193b9d-917b-4c5d-ab83-b824ad4518b6)
---
### 🖥️ Session Terminal  
![CloudBench_Session1](https://github.com/user-attachments/assets/96abf192-8307-4bd3-b7ed-06aa9233bc9b)
---
### 🐍 Running Python Server on Port 3000  
![CloudBench_Session2](https://github.com/user-attachments/assets/723088a0-48e1-4806-ac5b-9ad8f016800f)
---
### 🌐 Accessing the Python App via Public URL  
![CloudBench_Live](https://github.com/user-attachments/assets/f1aeef0f-f1a2-4d65-a40f-10639d63669a)


👋 Author
Rohit S. 🖤
