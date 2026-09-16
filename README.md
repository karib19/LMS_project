# Full Stack Learning Management System (LMS)

## Project Overview
This is a full stack Learning Management System (LMS) built using Django (Backend) and React (Frontend).
It provides role-based access for Admin, Instructor, and Student with secure JWT authentication.

---

## Live Demo

| | Link |
|---|---|
| **Frontend (Vercel)** | https://lms-rosy-alpha-76.vercel.app/ |
| **Backend API (Render)** | https://lms-project-qysk.onrender.com/api/ |
| **Admin Panel** | https://lms-project-qysk.onrender.com/admin/ |

> Note: The backend is hosted on Render's free tier, so the first request after a period of inactivity may take 30–50 seconds to respond (cold start).

---

## Features

### Authentication
- User Registration
- Login (JWT Authentication)
- Logout
- Protected Routes

### Role-Based System
- Admin
- Instructor
- Student

### Profile Management
- View Profile
- Update Profile

### Course Management
- Instructor can create courses
- Course listing for all users
- Category-based courses

### Enrollment System
- Students can enroll in courses

### Dashboard
- Total Users
- Total Courses
- Total Enrollments

### Password Management
- Forgot Password (basic)
- Reset Password

---

## Tech Stack

### Backend:
- Django
- Django REST Framework
- Simple JWT Authentication
- WhiteNoise (static file serving in production)
- Gunicorn (production WSGI server)

### Frontend:
- React (Vite)
- Axios
- Tailwind CSS

### Database:
- **Production:** PostgreSQL (hosted on [Neon](https://neon.tech))
- **Local development:** SQLite (default fallback if `DATABASE_URL` is not set)

### Deployment:
- **Backend:** [Render](https://render.com)
- **Frontend:** [Vercel](https://vercel.com)
- **Database:** [Neon](https://neon.tech) (Serverless PostgreSQL)

---

## Project Structure
```
Full Stack LMS Project/
│
├── lms_project/ (Django Backend)
├── lms-frontend/ (React Frontend)
├── screenshots/
├── build.sh (Render build script)
├── README.md
```

---

## Setup Instructions

### Backend Setup
```bash
cd lms_project
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd lms-frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (`.env` in `lms_project/`)
```
SECRET_KEY=your-django-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```
> If `DATABASE_URL` is not set, the project automatically falls back to local SQLite (`db.sqlite3`).

### Frontend (`.env` in `lms-frontend/`)
```
VITE_API_URL=http://127.0.0.1:8000/api
```
For production (Vercel), this is set to:
```
VITE_API_URL=https://lms-project-qysk.onrender.com/api
```

---

## API Base URL

| Environment | URL |
|---|---|
| Local | `http://127.0.0.1:8000/api/` |
| Production | `https://lms-project-qysk.onrender.com/api/` |

---

## Deployment Notes

- **Backend (Render):**
  - Build Command: `./build.sh`
  - Start Command: `gunicorn lms_project.wsgi`
  - Required environment variables: `DATABASE_URL`, `SECRET_KEY`, `DEBUG=False`
  - `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` in `settings.py` must include the deployed frontend and backend domains.

- **Frontend (Vercel):**
  - Root Directory: `lms-frontend`
  - Framework Preset: Vite
  - Environment variable `VITE_API_URL` must point to the live Render backend URL, then redeploy for it to take effect.

- **Database (Neon):**
  - Use the **pooled connection string** for the app's `DATABASE_URL` to avoid hitting connection limits under load.