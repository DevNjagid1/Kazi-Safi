# KAZI SAFI - Work Pay System

A comprehensive Django REST Framework + React payment management system for employee attendance tracking, payroll management, and M-Pesa integration.

## Features

- **Employee Attendance Tracking**: Check-in/check-out system with overtime calculation
- **User Dashboard**: Real-time earnings, withdrawal history, and work statistics
- **Admin Payroll Management**: Summary view of all employees' earnings and withdrawals
- **Support Tickets**: Employees can submit support tickets; admins can track and resolve
- **M-Pesa Integration**: Withdrawal requests with M-Pesa receipt tracking
- **Role-Based Access Control**: Admin and Employee roles with different permissions
- **JWT Authentication**: Secure token-based authentication
- **Real-time Data**: All frontend pages connected to backend APIs

## Tech Stack

**Backend**: Django 4.2, Django REST Framework, Simple JWT
**Frontend**: HTML5, CSS3, Vanilla JavaScript
**Database**: SQLite (development) / PostgreSQL (production)
**Authentication**: JWT (JSON Web Tokens)
**Deployment**: Heroku, Render, or PythonAnywhere (backend), GitHub Pages or Netlify (frontend)

## Project Structure

```
KAZI SAFI/
├── BACKEND/
│   ├── attendance_system/        # Main Django project
│   ├── accounts/                 # User authentication
│   ├── attendance/               # Attendance tracking
│   ├── payroll/                  # Payroll management
│   ├── support/                  # Support tickets
│   ├── employees/                # Employee management
│   ├── audit/                    # Audit logs
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3
└── FRONTEND/
    ├── *.html                    # Static pages
    ├── *.js                      # Page controllers
    ├── *.css                     # Styling
    └── login.html                # Entry point
```

## Getting Started (Local Development)

### Prerequisites
- Python 3.8+
- Git
- GitHub account

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/kazi-safi.git
cd kazi-safi/BACKEND

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. Open `FRONTEND/login.html` in a browser
2. Or use a local server: `python -m http.server 8001` in the FRONTEND folder
3. Access at: `http://localhost:8001/login.html`

## Deployment Guide

### Option 1: Deploy Backend to Heroku (Recommended for beginners)

#### 1. Prepare Backend for Heroku

Create `Procfile` in BACKEND directory:
```
web: gunicorn attendance_system.wsgi
```

Create `runtime.txt` in BACKEND:
```
python-3.11.7
```

Update `settings.py`:
```python
import os
from decouple import config

ALLOWED_HOSTS = ['yourdomain.herokuapp.com', 'localhost', '127.0.0.1']

# Database
if 'DATABASE_URL' in os.environ:
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config()
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# CORS
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.herokuapp.com",
    "http://localhost:3000",
    "http://localhost:8001",
]

DEBUG = config('DEBUG', default=False, cast=bool)
SECRET_KEY = config('SECRET_KEY')
```

#### 2. Deploy Steps

```bash
# Install Heroku CLI (if not already installed)
# Windows: choco install heroku
# Mac: brew tap heroku/brew && brew install heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False

# Deploy from git
git push heroku main
# or if your main branch is 'master'
git push heroku master

# Run migrations on Heroku
heroku run python manage.py migrate

# Create superuser on Heroku
heroku run python manage.py createsuperuser

# View logs
heroku logs --tail
```

Backend will be available at: `https://your-app-name.herokuapp.com`

---

### Option 2: Deploy Backend to Render.com (Free tier available)

1. Push code to GitHub (see below)
2. Go to [render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `gunicorn attendance_system.wsgi:application`
6. Set environment variables in Settings → Environment
7. Deploy

---

### Option 3: Deploy Backend to PythonAnywhere

1. Go to [pythonanywhere.com](https://www.pythonanywhere.com)
2. Create free account
3. Upload files via Web interface or Git
4. Configure Django in Web tab
5. Set up static files
6. Reload web app

---

### Deploy Frontend to GitHub Pages (Free)

#### 1. Create GitHub Repository for Frontend

```bash
cd FRONTEND
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/kazi-safi-frontend.git
git push -u origin main
```

#### 2. Enable GitHub Pages

1. Go to repository Settings
2. Scroll to "GitHub Pages" section
3. Select "Deploy from a branch"
4. Choose branch: `main`
5. Your frontend will be at: `https://yourusername.github.io/kazi-safi-frontend/`

#### 3. Update API URLs in Frontend

Update all `http://localhost:8000` to your deployed backend URL:

```javascript
// In each .js file, change:
const API_BASE = 'https://your-deployed-backend.herokuapp.com';

// Then use:
fetch(`${API_BASE}/attendance/api/`, { ... })
```

---

### Option 4: Deploy Frontend + Backend to Vercel (Full Stack)

1. Create separate repos for FRONTEND and BACKEND
2. For frontend on Vercel:
   - Connect GitHub repo
   - Set build command: `npm build` (if using build tools)
   - Deploy

3. For backend on Vercel (serverless):
   - More complex; use a flask wrapper or API routes

---

## GitHub Setup (Complete Steps)

### 1. Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "New" button
3. Name: `kazi-safi` (or your preference)
4. Description: "Work Pay System - Attendance & Payroll Management"
5. Make it **Public** (so it can be hosted via GitHub Pages)
6. Click "Create repository"

### 2. Initialize Git Locally

```bash
cd "c:\Users\K8hen\Desktop\KAZI SAFI(WORK PAY SYSYTEM)"

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: KAZI SAFI Work Pay System"

# Add remote
git remote add origin https://github.com/yourusername/kazi-safi.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Verify on GitHub

- Visit `https://github.com/yourusername/kazi-safi`
- You should see all your files

---

## Environment Variables

Create `.env` file in BACKEND (don't commit this!):

```
SECRET_KEY=your-super-secret-key-here
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
JWT_SECRET=your-jwt-secret
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS errors | Add frontend URL to `CORS_ALLOWED_ORIGINS` in settings.py |
| 404 errors on API | Ensure backend is running on correct port |
| Static files not loading | Run `python manage.py collectstatic` |
| Database locked | Delete `db.sqlite3` and run `python manage.py migrate` |
| Authentication fails | Check JWT token in browser localStorage |

---

## Next Steps

1. ✅ Create GitHub account if you don't have one
2. ✅ Choose deployment platform (Heroku/Render for backend)
3. ✅ Push code to GitHub
4. ✅ Deploy backend first
5. ✅ Update frontend API URLs
6. ✅ Deploy frontend to GitHub Pages or Vercel
7. ✅ Test all features on live server

---

## Support

For issues or questions:
- Check Django documentation: https://docs.djangoproject.com
- Django REST Framework: https://www.django-rest-framework.org
- Deployment help: https://www.heroku.com/platform/documentation
