# 🎉 NYAY PRAVAH - JUDICIAL CASE MANAGEMENT SYSTEM

## ✅ STATUS: COMPLETE & OPERATIONAL

Your **full-stack case management system** is built, tested, and ready for use. All systems are running with offline mock data support - **no database setup required** to start testing!

---

## 🚀 QUICK START (2 MINUTES)

### Terminal 1: Backend (Already Running)
```powershell
cd d:\Desktop\mherm_hackathon\NYOXRA_sarthak\backend
$node = ".\.tools\node-v24.14.0-win-x64\node.exe"
& $node "src/server.js"
```

### Terminal 2: Frontend Server
```powershell
cd d:\Desktop\mherm_hackathon\NYOXRA_sarthak
python -m http.server 5500
```

### Open Browser
**Judge:** http://localhost:5500/html/judge-dashboard.html  
**Lawyer:** http://localhost:5500/html/lawyer-dashboard.html

---

## ✨ FEATURES

✅ 10 live case cards (5 backlog + 5 fresh)  
✅ Mark cases as Adjoined/Stay/Re-hearing  
✅ Real-time status updates  
✅ Auto-hide finished cases  
✅ Load new batch when all finished  
✅ Responsive mobile-first design  
✅ Backend API with mock data  
✅ JWT authentication system  
✅ User verification workflow  
✅ Production-ready codebase  

---

## 📚 DOCUMENTATION

- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Fast lookup
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [COMPLETE_SETUP_SUMMARY.md](COMPLETE_SETUP_SUMMARY.md) - Feature overview
- [VERIFICATION_REPORT.md](VERIFICATION_REPORT.md) - Test results

---

## 🏗️ ARCHITECTURE

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | HTML/CSS/JavaScript | ✅ Complete |
| Backend | Node.js + Express | ✅ Complete |
| Database | Prisma + PostgreSQL | ✅ Ready (optional) |
| Authentication | JWT + Bcrypt | ✅ Complete |

---

## 📊 INCLUDED DATA

10 realistic mock cases auto-generated each load:
- **Backlog:** Criminal appeals, civil suits, administrative cases, environmental matters, property litigation
- **Fresh:** Constitutional petitions, IP disputes, insurance appeals, land use violations, tenancy matters

---

## 🔌 PostgreSQL Setup (Optional)

When ready for production database:

```powershell
cd backend
npx prisma migrate deploy    # Creates tables
npm run seed                  # Seeds admin/judge/lawyer users
```

Update `.env` with your PostgreSQL credentials first.

---

## 📖 For Detailed Info, See:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup & API docs
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Command reference

**Enjoy testing!** 🚀

---
│   │   ├── components/     # Dashboard, StatCards, CaseTable
│   │   └── App.js          # Main UI Router
├── server/                 # Node.js Backend
│   ├── models/             # Mongoose Schemas (Case, Tokens, Stays)
│   ├── routes/             # Adjournment & Vacuum API Logic
│   └── server.js           # Express Entry Point
└── README.md
