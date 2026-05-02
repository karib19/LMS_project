#  Full Stack Learning Management System (LMS)

##  Project Overview
This is a full stack Learning Management System (LMS) built using Django (Backend) and React (Frontend).
It provides role-based access for Admin, Instructor, and Student with secure JWT authentication.

---

##  Features

###  Authentication
- User Registration
- Login (JWT Authentication)
- Logout
- Protected Routes

### 👥 Role-Based System
- Admin
- Instructor
- Student

###  Profile Management
- View Profile
- Update Profile

###  Course Management
- Instructor can create courses
- Course listing for all users
- Category-based courses

###  Enrollment System
- Students can enroll in courses

###  Dashboard
- Total Users
- Total Courses
- Total Enrollments

###  Password Management
- Forgot Password (basic)
- Reset Password

---

##  Tech Stack

### Backend:
- Django
- Django REST Framework
- Simple JWT Authentication

### Frontend:
- React (Vite)
- Axios
- Tailwind CSS

### Database:
- SQLite

---

##  Project Structure
Full Stack LMS Project/
│
├── lms_project/ (Django Backend)
├── lms-frontend/ (React Frontend)
├── screenshots/
├── README.md


---

##  Setup Instructions

### Backend Setup
```bash
cd lms_project
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend Setup

cd lms-frontend
npm install
npm run dev


 API Base URL
http://127.0.0.1:8000/api/