# ⚡ QUICK REFERENCE

## Running Systems

### Backend (Port 4000)
```powershell
cd d:\Desktop\mherm_hackathon\NYOXRA_sarthak\backend
$node = ".\\.tools\\node-v24.14.0-win-x64\\node.exe"
& $node "src/server.js"
```
✅ Already running - serves API + mock data

### Frontend (Port 5500)
```powershell
cd d:\Desktop\mherm_hackathon\NYOXRA_sarthak
python -m http.server 5500
```
Serve HTML/CSS/JS files

---

## Test URLs

| What | URL |
|------|-----|
| Judge Dashboard | http://localhost:5500/html/judge-dashboard.html |
| Lawyer Dashboard | http://localhost:5500/html/lawyer-dashboard.html |
| API Health | http://localhost:4000/api/health |
| Cases Data | http://localhost:4000/api/dashboard/view |

---

## Files Changed This Session

| File | Change |
|------|--------|
| backend/src/server.js | Added offline mode + protect middleware |
| backend/src/docketService.js | Rewrote for mock data + offline support |
| backend/src/auth.js | Auth bypass for offline testing |
| scripts/dashboard.js | Already integrated with API |
| html/judge-dashboard.html | Updated footer + case layout |
| html/lawyer-dashboard.html | Updated footer + case layout |

---

## Test Checklist

- [ ] Backend responds on port 4000
- [ ] Frontend loads on port 5500
- [ ] Judge dashboard shows 10 cases
- [ ] Lawyer dashboard shows 10 cases
- [ ] Can mark case as "Adjoined" with date
- [ ] Can mark case as "Stay" with date
- [ ] Can mark case as "Re-hearing" with date
- [ ] Marked cases disappear from view
- [ ] When all finished, "Load New Cases" appears
- [ ] Load new cases fills backlog/fresh sections
- [ ] Balance meter updates in real-time
- [ ] Hover shows full case description

---

## Common Commands

```powershell
# Kill background process
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Check database connectivity
cd backend
npx prisma db push --skip-generate

# When PostgreSQL ready
npx prisma migrate deploy
npm run seed
```

---

## Key Endpoints

```bash
# Get all cases
GET http://localhost:4000/api/dashboard/view

# Update case
POST http://localhost:4000/api/cases/BP001/action
{
  "action": "adjoined",
  "actionDate": "2026-03-22"
}

# Load new batch
POST http://localhost:4000/api/cases/load-new
```

---

## Documentation Files

- [Full Setup Guide](SETUP_GUIDE.md)
- [Complete Summary](COMPLETE_SETUP_SUMMARY.md)
- [Verification Report](VERIFICATION_REPORT.md)
- This file: Quick Reference

---

## Status: ✅ READY TO TEST

Backend is running. Frontend is ready.  
Open dashboards and test case operations.

