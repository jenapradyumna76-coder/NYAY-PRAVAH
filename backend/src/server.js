const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const {
    getDashboardView,
    updateCaseAction,
    loadNewCasesIfAllFinished,
    runNightlyRollover,
    registerUser,
    loginUser,
    verifyUserByAdmin,
    listPendingUsers
} = require('./docketService');
const { issueToken, authenticateToken } = require('./auth');

const app = express();
const PORT = process.env.PORT || 4000;
let prisma = null;
let dbConnected = false;

// Attempt database connection
(async () => {
    try {
        prisma = new PrismaClient();
        await prisma.$queryRaw`SELECT 1`;
        dbConnected = true;
        console.log('[DB] Connected to PostgreSQL.');
    } catch (error) {
        console.warn('[DB] Connection failed. Running in offline mode with mock data.');
        console.warn('[DB] To enable database: set DATABASE_URL in .env and run `npx prisma migrate deploy`.');
        dbConnected = false;
    }
})();

function protect(allowedRoles = []) {
    return async (req, res, next) => {
        try {
            // In offline mode, bypass auth checks
            if (!dbConnected) {
                req.authUser = { id: 1, role: 'JUDGE', status: 'VERIFIED', email: 'demo@test.com' };
                return next();
            }

            if (!req.user || !req.user.sub) {
                return res.status(401).json({ ok: false, error: 'Unauthorized.' });
            }

            const dbUser = await prisma.user.findUnique({
                where: { id: Number(req.user.sub) }
            });

            if (!dbUser) {
                return res.status(401).json({ ok: false, error: 'User not found.' });
            }

            if (dbUser.status !== 'VERIFIED') {
                return res.status(403).json({ ok: false, error: '403 Forbidden: user is not VERIFIED.' });
            }

            if (allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role)) {
                return res.status(403).json({ ok: false, error: '403 Forbidden: insufficient role.' });
            }

            req.authUser = dbUser;
            return next();
        } catch (error) {
            return res.status(500).json({ ok: false, error: error.message });
        }
    };
}

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ ok: true, service: 'nyay-pravah-backend' });
});

app.get('/api/dashboard/view', authenticateToken, protect(), async (req, res) => {
    try {
        const view = await getDashboardView();
        res.json({ ok: true, ...view });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

app.post('/api/cases/:id/action', async (req, res) => {
    try {
        const caseId = req.params.id;
        const { action, actionDate, actor } = req.body || {};
        const view = await updateCaseAction(caseId, action, actionDate, actor || 'judge');
        res.json({ ok: true, message: `Case ${caseId} updated.`, ...view });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
});

app.post('/api/cases/load-new', async (req, res) => {
    try {
        const result = await loadNewCasesIfAllFinished();
        res.json({ ok: true, ...result });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
});

app.post('/api/scheduler/rollover', async (req, res) => {
    try {
        const result = await runNightlyRollover();
        res.json({ ok: true, ...result });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

app.post('/api/users/register', async (req, res) => {
    try {
        const user = await registerUser(req.body || {});
        res.status(201).json({ ok: true, message: 'User created with PENDING status.', user });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const user = await loginUser(email, password);
        const token = issueToken(user);
        res.json({ ok: true, token, user });
    } catch (error) {
        res.status(401).json({ ok: false, error: error.message });
    }
});

app.get('/api/admin/users/pending', authenticateToken, protect(['ADMIN']), async (req, res) => {
    try {
        const users = await listPendingUsers();
        res.json({ ok: true, users });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

app.patch('/api/admin/users/:id/verify', authenticateToken, protect(['ADMIN']), async (req, res) => {
    try {
        const userId = req.params.id;
        const { barCouncilId } = req.body || {};
        const user = await verifyUserByAdmin(userId, barCouncilId);
        res.json({ ok: true, message: 'User status updated to VERIFIED.', user });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
});

cron.schedule('0 0 * * *', async () => {
    try {
        const result = await runNightlyRollover();
        const marker = result.changed ? 'changed' : 'no-change';
        console.log(`[scheduler] midnight rollover ${marker} - backlog=${result.view.counts.backlog}, fresh=${result.view.counts.fresh}`);
    } catch (error) {
        console.error('[scheduler] rollover failed:', error.message);
    }
});

app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Backend running on http://localhost:${PORT}`);
    if (!dbConnected) {
        console.log(`\n[!] OFFLINE MODE - Using mock data for testing.`);
        console.log(`[!] To enable PostgreSQL: `);
        console.log(`    1. Install PostgreSQL locally or use Supabase/Railway`);
        console.log(`    2. Update DATABASE_URL in .env with real credentials`);
        console.log(`    3. Run: npx prisma migrate deploy`);
        console.log(`    4. Run: npm run seed`);
        console.log(`    5. Restart this server`);
    }
    console.log(`${'='.repeat(60)}\n`);
});
