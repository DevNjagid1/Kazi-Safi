# Quick Deployment Checklist

## Step 1: Prepare Code ✅
- [ ] Add `.gitignore` file (done)
- [ ] Create `requirements.txt` (done)
- [ ] Create `Procfile` (done)
- [ ] Create `runtime.txt` (done)
- [ ] Create `README.md` (done)

## Step 2: GitHub Setup (5 minutes)
```bash
# 1. Create GitHub account if needed
#    Visit: https://github.com/signup

# 2. Create new repository
#    Go to github.com → Click "New"
#    Name: kazi-safi
#    Make it PUBLIC

# 3. Initialize git locally
cd "c:\Users\K8hen\Desktop\KAZI SAFI(WORK PAY SYSYTEM)"
git init
git add .
git commit -m "Initial commit: KAZI SAFI Work Pay System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kazi-safi.git
git push -u origin main
```

## Step 3: Deploy Backend (15 minutes)

### Option A: Heroku (Recommended)
```bash
# Install Heroku CLI
# Windows: choco install heroku

# Login and deploy
heroku login
heroku create your-app-name-123
heroku config:set SECRET_KEY=your-random-secret-key
git push heroku main

# Set up database
heroku run python manage.py migrate
heroku run python manage.py createsuperuser

# Test
# Visit: https://your-app-name-123.herokuapp.com/accounts/api/login/
```

### Option B: Render.com (Free & Easy)
1. Go to render.com
2. Click "New +" → "Web Service"
3. Connect GitHub → Select `kazi-safi` repo
4. Build Command: `pip install -r BACKEND/requirements.txt && cd BACKEND && python manage.py migrate`
5. Start Command: `cd BACKEND && gunicorn attendance_system.wsgi:application`
6. Set env vars in dashboard
7. Deploy!

## Step 4: Update Frontend (5 minutes)

In each JavaScript file, replace:
```javascript
// OLD
const API_URL = 'http://localhost:8000'

// NEW
const API_URL = 'https://your-deployed-backend-url.herokuapp.com'
```

Files to update:
- [ ] FRONTEND/login.js
- [ ] FRONTEND/employees.js
- [ ] FRONTEND/payroll.js
- [ ] FRONTEND/user.js
- [ ] FRONTEND/userearning.js
- [ ] FRONTEND/userwithdrawal.js
- [ ] FRONTEND/userattendance.js
- [ ] FRONTEND/attendance.js
- [ ] FRONTEND/support.js
- [ ] FRONTEND/contactadmin.js
- [ ] FRONTEND/audit.js
- [ ] FRONTEND/admin.js

## Step 5: Deploy Frontend (5 minutes)

### Option A: GitHub Pages (Easiest)
1. Create new repo: `kazi-safi-frontend`
2. Upload FRONTEND folder
3. Go to Settings → GitHub Pages
4. Select "main" branch
5. Your site: `https://username.github.io/kazi-safi-frontend/`

### Option B: Netlify (5 min setup)
1. Go to netlify.com
2. Click "New site from Git"
3. Connect GitHub → Select frontend repo
4. Deploy!

## Step 6: Test Live (10 minutes)

- [ ] Visit frontend URL
- [ ] Try login with test credentials
- [ ] Check admin dashboard
- [ ] Try attendance check-in
- [ ] Check payroll view

## Estimated Time: 40 minutes total

---

## Helpful Links

- Git/GitHub: https://guides.github.com/introduction/git-handbook/
- Heroku Deployment: https://devcenter.heroku.com/articles/getting-started-with-django
- Render Deployment: https://render.com/docs/deploy-django
- GitHub Pages: https://pages.github.com/
- Netlify: https://www.netlify.com/

---

## Post-Deployment

1. Share live URL with team
2. Set up custom domain (optional)
3. Enable SSL/HTTPS (automatic on Heroku/Render)
4. Monitor logs for errors
5. Back up database regularly

---

## Need Help?

💬 Common Issues:
- **CORS Error**: Add frontend URL to backend `CORS_ALLOWED_ORIGINS`
- **API not working**: Check backend logs with `heroku logs --tail`
- **Static files missing**: Run `python manage.py collectstatic`
- **Database issues**: Reset with `heroku run python manage.py migrate --plan`
