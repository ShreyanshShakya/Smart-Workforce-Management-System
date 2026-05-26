# Smart Workforce Management System

![Project Banner](https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2850&auto=format&fit=crop)

A full-stack, enterprise-grade Workforce Management System designed to streamline task delegation, track employee progress, and analyze team performance in real-time.

Built with a robust **Spring Boot** backend and a beautiful, modern **React (Vite)** frontend, this application features Role-Based Access Control (RBAC), secure JWT authentication, and real-time WebSockets.

---

## 🚀 Features

- **Role-Based Access Control (RBAC)**: Secure access tailored for `ADMIN`, `MANAGER`, and `EMPLOYEE` roles.
- **Real-Time Updates**: Tasks update live across all connected clients via STOMP WebSockets—no page refresh required.
- **Task Management Lifecycle**: Create, assign, prioritize, and track the status of tasks (Pending, In Progress, Completed).
- **Secure Authentication**: End-to-end security using JWT (JSON Web Tokens) with a hardened public registration flow.
- **Modern UI/UX**: A dark-themed, glassmorphism design built with Tailwind CSS v4 for an ultra-premium feel.
- **DevOps Ready**: Fully containerized with Docker, multi-stage builds, and Nginx reverse proxy.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS v4** (Utility-first styling, Glassmorphism)
- **React Router v6** (Protected routing)
- **Axios** (API Client)
- **STOMP.js** (WebSockets)

### Backend
- **Java 17** & **Spring Boot 3**
- **Spring Security & JWT** (Authentication & Authorization)
- **Spring Data JPA** (Hibernate)
- **Spring WebSockets** (Real-time broadcasting)
- **MySQL 8.4** (Database)

### DevOps
- **Docker & Docker Compose**
- **Nginx** (Frontend Web Server & Reverse Proxy)
- **Multi-Stage Builds** (Zero-dependency builds)

---

## 🐳 Quick Start (Local Deployment)

The easiest way to run the entire application is using Docker. You do **not** need Java or Node.js installed on your machine—just Docker!

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShreyanshShakya/Smart-Workforce-Management-System.git
   cd Smart-Workforce-Management-System
   ```

2. **Spin up the stack**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the Application**
   - Frontend UI: [http://localhost](http://localhost)
   - Backend API: [http://localhost:8081/api](http://localhost:8081/api)

*Note: The MySQL database will automatically initialize. You can register a new account on the frontend to get started.*

---

## ☁️ Cloud Deployment (Vercel & Render)

This repository is configured to easily deploy to free PaaS providers for a live showcase.

### 1. Backend (Render / Railway)
- Connect your GitHub repo to a free Render Web Service.
- Set the Root Directory to `backend`.
- Add environment variables:
  - `SPRING_DATASOURCE_URL`, `USERNAME`, `PASSWORD` (Point to a free MySQL provider like Aiven).
  - `ALLOWED_ORIGINS`: `https://your-frontend.vercel.app`

### 2. Frontend (Vercel)
- Import the repository into Vercel and set the Root Directory to `frontend`.
- Add environment variables:
  - `VITE_API_URL`: `https://your-backend.onrender.com/api`
  - `VITE_WS_URL`: `wss://your-backend.onrender.com/ws`

---

## 🔐 Security Architecture

- **Stateless Sessions**: Uses Bearer Tokens (JWT) meaning the backend scales horizontally with ease.
- **Endpoint Protection**: `/api/users` is locked to `ADMIN` only to prevent privilege escalation.
- **CORS Handling**: Configurable `ALLOWED_ORIGINS` dynamically blocks unauthorized cross-origin requests.

---

*Developed by Shreyansh Shakya*
