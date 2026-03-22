# NYAY PRAVAH Backend

This backend provides persistent docket state, judge case actions, daily rollover scheduling, and APIs used by judge/lawyer dashboards.

## Features Implemented

- Persistent case storage in `backend/data/docket.json`
- Judge actions on cases:
  - `adjoined` (finished)
  - `stay`
  - `rehearing`
- Date-aware carry-forward logic:
  - Cases scheduled for future dates stay hidden until due date
  - Due carry-forward cases appear automatically on that date
- Daily section balancing (5 backlog + 5 fresh target)
- Midnight scheduler (`node-cron`) for nightly rollover
- Manual API trigger for rollover
- Manual API trigger for loading new cases only when all visible cases are finished

## API Endpoints

- `GET /api/health`
- `GET /api/dashboard/view`
- `POST /api/cases/:id/action`
  - Body: `{ "action": "adjoined|stay|rehearing", "actionDate": "YYYY-MM-DD", "actor": "judge" }`
- `POST /api/cases/load-new`
- `POST /api/scheduler/rollover`

## Run Locally

1. Install Node.js 18+ (includes npm)
2. Open terminal in `backend`
3. Run:

```bash
npm install
npm start
```

Server starts at `http://localhost:4000`.

## Frontend Integration

The dashboard frontend (`scripts/dashboard.js`) now calls:

- `http://localhost:4000/api/dashboard/view`
- `http://localhost:4000/api/cases/:id/action`
- `http://localhost:4000/api/cases/load-new`

If backend is not running, dashboard shows a message in toast.

## Backend Hardening Checklist (Recommended Next)

- Add authentication + role-based access (judge/lawyer/admin)
- Add request rate limiting and API key/JWT validation
- Add input validation library (e.g., zod/joi) for all payloads
- Move storage to PostgreSQL or MySQL for concurrency and scale
- Add audit logs for all judge actions (who changed what and when)
- Add automatic backups and recovery for case data
- Add structured logging and monitoring (health + alerts)
- Add HTTPS termination and secure deployment configuration
- Add test suite (unit + API integration tests)
- Add environment variables for port, CORS policy, timezone, and scheduler config
