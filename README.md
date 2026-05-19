# Live Chat Support Dashboard

Enterprise-grade live support ticketing, real-time chat, admin analytics, and role-based service desk automation.

## Project Structure
- `backend/` � Node.js, Express, MySQL, Socket.io, authentication, ticketing, reports
- `frontend/` � React, Bootstrap, Axios, React Router, real-time chat UI
- `database/` � MySQL schema for XAMPP/phpMyAdmin

## Requirements
- Node.js 18+
- npm
- XAMPP (Apache + MySQL)
- MySQL database named `support_dashboard`

## Setup Instructions

### 1. Import the SQL schema
1. Start Apache and MySQL in XAMPP Control Panel.
2. Open phpMyAdmin.
3. Import `database/support_dashboard.sql`.

### 1a. Optional Python schema import
1. Install Python dependencies:
```bash
cd scripts
python -m pip install -r requirements.txt
```
2. Run the helper script:
```bash
python load_schema.py
```

### 2. Configure backend environment
1. Copy `backend/.env.example` to `backend/.env`.
2. Update database and SMTP values as needed.

### 2a. Configure frontend environment
1. Copy `frontend/.env.example` to `frontend/.env` if you need a custom API or socket URL.
2. The default values already target `http://localhost:5000`.

### 3. Install backend dependencies
```bash
cd backend
npm install
```

### 4. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### 5. Run the backend server
```bash
cd backend
npm run dev
```

### 6. Run the frontend app
```bash
cd frontend
npm start
```

## Application URLs
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- phpMyAdmin: `http://localhost/phpmyadmin`

## New Support Pages
- `Help & Support` page for guidance, live chat access, and support resources.
- `Feedback` page so users can submit ratings and comments for their ticket experience.

## Default Data and Notes
- Use the registration screen to create a new account.
- Set a user as `support` or `admin` via the backend to unlock staff/admin dashboards.
- Real-time chat is ticket-based and uses Socket.io rooms.
- Notification emails require SMTP credentials in `.env`.

## Deployment Guide
1. Deploy the backend to a Node.js host with MySQL access.
2. Build the frontend with `npm run build`.
3. Serve the React build from static hosting or connect to the backend API.
4. Configure environment variables on the server and ensure `JWT_SECRET` is secure.

## Features
- JWT authentication with bcrypt password hashing
- Role-based routes for user, support, admin
- Ticket creation, assignment, status tracking
- Real-time ticket chat and message history
- Admin reports, performance analytics, category management
- MySQL XAMPP-compatible schema with audit logs and feedback
