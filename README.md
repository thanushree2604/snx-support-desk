# Live Chat Support Dashboard

A support desk application with real-time chat, ticketing, role-based access, admin analytics, and feedback management.

GitHub repository: https://github.com/thanushree2604/snx-support-desk

## Project Overview
- `backend/` – Node.js + Express server with MySQL, Socket.io, JWT authentication, ticket APIs, reporting, and email support.
- `frontend/` – React application with Bootstrap, Axios, React Router, and live ticket chat functionality.
- `database/` – MySQL schema definitions and sample SQL for `support_dashboard`.
- `scripts/` – Optional Python utility to load or reset the database schema.

## Tech Stack
- Backend: Node.js, Express, MySQL, Socket.io, bcrypt, JWT, nodemailer
- Frontend: React, Bootstrap, Axios, React Router, chart.js
- Database: MySQL (XAMPP-compatible schema)

## Requirements
- Node.js 18 or newer
- npm
- MySQL server (XAMPP recommended for local development)
- Git

## Setup

### 1. Import database schema
1. Start MySQL (via XAMPP or your local MySQL service).
2. Create a database named `support_dashboard`.
3. Import `database/support_dashboard.sql` using phpMyAdmin or MySQL CLI.

### 2. Configure backend environment
1. Copy `backend/.env.example` to `backend/.env`.
2. Fill in your MySQL credentials, SMTP settings, and `JWT_SECRET`.

### 3. Configure frontend environment (optional)
1. If needed, copy `frontend/.env.example` to `frontend/.env`.
2. Update `REACT_APP_API_URL` or socket URL if the backend is not at `http://localhost:5000`.

### 4. Install dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 5. Run the application
```bash
cd backend
npm run dev
```

In another terminal:
```bash
cd frontend
npm start
```

## Local URLs
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## Application Features
- User registration and login
- Role-based access for users, support staff, and admins
- Ticket creation, assignment, priority/status updates
- Real-time Socket.io chat per ticket
- Admin dashboard with analytics and reports
- Feedback submission and rating system
- Category management and ticket filtering
- Email notifications for ticket events

## Notes
- Use the registration page to create the initial user account.
- Admin/support roles must be assigned through the database or admin interface.
- Ensure SMTP credentials are valid for sending notification emails.

## Deployment
1. Deploy the backend to any Node.js host with MySQL access.
2. Build the frontend with `npm run build`.
3. Host the frontend build on static web hosting or serve through the backend.
4. Set environment variables for production secrets and database connection.

## Repository
This project is published at:

https://github.com/thanushree2604/snx-support-desk
