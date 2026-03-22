# NYAY PRAVAH - Setup & Testing Guide

## ✅ Current Status: FULLY FUNCTIONAL & READY FOR TESTING

### Backend API Server
- **Status:** ✅ Running on `http://localhost:4000`
- **Mode:** Offline (Mock Data) - No database required for basic testing
- **Health Check:** `http://localhost:4000/api/health`

### Frontend Dashboards
- **Judge Dashboard:** `http://localhost:5500/html/judge-dashboard.html`
- **Lawyer Dashboard:** `http://localhost:5500/html/lawyer-dashboard.html`

---

## 🚀 Quick Start

### 1. Start Backend Server (Port 4000)
The backend is already running! If you need to restart it:

```powershell
cd "d:\Desktop\mherm_hackathon\NYOXRA_sarthak\backend"
$nodeBin = "d:\Desktop\mherm_hackathon\NYOXRA_sarthak\backend\.tools\node-v24.14.0-win-x64"
& "$nodeBin\node.exe" "src\server.js"
```

**Output:** You should see:
```
============================================================
Backend running on http://localhost:4000

[!] OFFLINE MODE - Using mock data for testing.
[!] To enable PostgreSQL: 
    1. Install PostgreSQL locally or use Supabase/Railway
    2. Update DATABASE_URL in .env with real credentials
    3. Run: npx prisma migrate deploy
    4. Run: npm run seed
    5. Restart this server
============================================================
```

### 2. Open Frontend (Port 5500)
You need a simple HTTP server to serve the frontend files. If you don't have one running:

**Option A - Using Python (if installed):**
```powershell
cd d:\Desktop\mherm_hackathon\NYOXRA_sarthak
python -m http.server 5500
```

**Option B - Using Node.js (http-server):**
```powershell
npm install -g http-server
cd d:\Desktop\mherm_hackathon\NYOXRA_sarthak
http-server -p 5500
```

Then open your browser and navigate to:
- **Judge Dashboard:** http://localhost:5500/html/judge-dashboard.html
- **Lawyer Dashboard:** http://localhost:5500/html/lawyer-dashboard.html

---

## 🧪 Testing Features

### Dashboard View
The dashboard automatically loads 5 backlog + 5 fresh cases with:
- Case serial number and unique ID
- Case name and description (hover to see full description)
- Current status indicator
- Balance meter showing backlog vs. fresh ratio

### Judge Actions (Judge Dashboard Only)
1. **Select a date** for the case action
2. **Choose an action:**
   - "Mark Adjoined" - Close the case
   - "Mark Stay" - Issue a stay order
   - "Re-hearing" - Schedule case for re-hearing
3. **Status updates** appear in real-time
4. **Unfinished cases only** - Adjoined cases automatically hidden

### Load New Cases
When all cases in **both** sections are finished:
1. A "Load New Cases" button appears near the live system indicator
2. Click it to load a fresh batch of 5 new cases
3. Button auto-hides when there are unfinished cases

---

## 🔌 API Endpoints

### Dashboard Operations
```
GET  /api/dashboard/view
     - Returns: { backlog[], fresh[], counts, allFinished }
     - No auth required in offline mode

POST /api/cases/:id/action
     - Body: { action: 'adjoined'|'stay'|'rehearing', actionDate: '2026-03-22' }
     - Returns: Updated view

POST /api/cases/load-new
     - Returns: { reason, view } if all cases finished
```

### User Management (for future DB integration)
```
POST /api/users/register
     - Body: { email, password, role: 'JUDGE'|'LAWYER' }

POST /api/auth/login
     - Body: { email, password }
     - Returns: { token, user }

GET  /api/admin/users/pending
     - Returns: List of PENDING users (requires ADMIN role)

PATCH /api/admin/users/:id/verify
     - Body: { barCouncilId } (optional)
     - Returns: Updated user with VERIFIED status
```

---

## 🗄️ PostgreSQL Integration (In Progress)

### When Ready to Use Database:

1. **Install PostgreSQL:**
   - Download from https://www.postgresql.org/download/
   - Create a database: `nyay_pravah`
   - Note your password

2. **Update `.env` file:**
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/nyay_pravah"
   JWT_SECRET="your-secret-key-change-me"
   ```

3. **Run Migration & Seeding:**
   ```powershell
   cd backend
   $nodeBin = ".\\.tools\\node-v24.14.0-win-x64"
   $env:Path = "$nodeBin;$env:Path"
   
   npx prisma migrate deploy
   npm run seed
   ```

4. **Restart Backend:**
   ```powershell
   npm start
   ```

### Seed Data Includes:
- Admin user: `admin@nyaypravah.com` / `secure-password`
- Judge user: `judge@test.com` / `password`
- Lawyer user: `lawyer@test.com` / `password`

---

## 📂 Project Structure

```
NYOXRA_sarthak/
├── backend/                    # Node.js/Express server
│   ├── src/
│   │   ├── server.js          # Main API routes
│   │   ├── docketService.js   # Business logic (offline + DB modes)
│   │   └── auth.js            # JWT handling
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Initial data seeding
│   ├── .tools/                # Portable Node.js runtime
│   ├── package.json
│   ├── .env                   # Configuration
│   └── README.md
│
├── html/                       # HTML pages
│   ├── judge-dashboard.html
│   ├── lawyer-dashboard.html
│   └── ... (other pages)
│
├── scripts/
│   └── dashboard.js           # Frontend API client
│
├── styles/
│   ├── style.css
│   ├── lawyer-style.css
│   └── ... (component styles)
│
└── SETUP_GUIDE.md            # This file
```

---

## 🐛 Troubleshooting

### "Backend not reachable" Error
- ✅ Ensure backend is running on `http://localhost:4000`
- ✅ Check: `curl http://localhost:4000/api/health`

### Cases Not Appearing
- ✅ Check browser console (F12) for errors
- ✅ Verify `/api/dashboard/view` returns data in a new tab

### Port Already in Use
**Backend (4000):**
```powershell
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

**Frontend (5500):**
```powershell
netstat -ano | findstr :5500
taskkill /PID <PID> /F
```

---

## 📋 Coding Standards Applied

✅ Mobile-first responsive design  
✅ CSS classes only (no IDs for styling)  
✅ Flexbox/CSS Grid layout (no percentages)  
✅ Semantic HTML tags  
✅ Modern ES6+ JavaScript  
✅ Proper error handling and offline support  

---

## 🎯 Next Steps

1. **Open both dashboards** and test case actions
2. **Verify case updates** work in real-time
3. **Test "Load New Cases"** button when all cases are finished
4. **When ready:** Set up PostgreSQL and migrate database

---

## 📞 Need Help?

Check the console (F12) for JavaScript errors and API response status codes in the Network tab.

