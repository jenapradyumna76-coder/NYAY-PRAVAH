const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

let prisma = null;
let offlineMode = false;

// Try to get Prisma client; if it fails, use offline mode
(async () => {
    try {
        prisma = new PrismaClient();
        await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
        console.log('[Offline Mode] Database unavailable; using mock data.');
        offlineMode = true;
        prisma = null;
    }
})().catch(err => {
    console.log('[Offline Mode] Failed to initialize DB; using mock data.');
    offlineMode = true;
    prisma = null;
});

const DAILY_SECTION_TARGET = 5;

const BACKLOG_SEED = [
    { name: 'State vs. Kumar', description: 'Criminal appeal - Murder charge conviction review. High priority due to pending sentence appeal.' },
    { name: 'National Bank Ltd. vs. Sharma', description: 'Civil suit - Loan dispute involving Rs. 50 lakhs. Matter listed for final arguments hearing.' },
    { name: 'Gupta Enterprises vs. Ministry', description: 'Administrative case - Tax assessment challenge. Awaiting bench orders on preliminary objections.' },
    { name: 'People vs. Industrial Corp', description: 'Environmental violation case - Pollution control matter. Scheduled for witness examination.' },
    { name: 'Singh Family Trust vs. Others', description: 'Property litigation - Inheritance dispute over ancestral property. Case in final arguments stage.' },
    { name: 'Commissioner vs. Verma Group', description: 'Revenue appeal - Wrongful tax exemption claim under financial compliance review.' },
    { name: 'State Electricity Board vs. Orion Steel', description: 'Contract enforcement matter related to unpaid industrial dues and penalties.' },
    { name: 'People Forum vs. City Planning Dept.', description: 'Public interest litigation on zoning violations and restoration directions.' }
];

const FRESH_SEED = [
    { name: 'Patel vs. Government', description: 'Constitutional petition - Right to education claim. Filed for urgent hearing consideration.' },
    { name: 'Tech Innovations Ltd. vs. Competitors', description: 'Intellectual property dispute - Patent infringement claim. Civil suit for damages and injunction.' },
    { name: 'Sharma Insurance vs. Claimants', description: 'Insurance claim rejection appeal. Parties submitted written statements. Awaiting evidence.' },
    { name: 'Municipal Authority vs. Developers', description: 'Land use violation case - Unauthorized construction complaint. Interim measures granted.' },
    { name: 'Rajesh vs. Landlord', description: 'Tenancy dispute - Unlawful eviction case. Preliminary hearing scheduled for next week.' },
    { name: 'Rural Co-op Bank vs. Nair', description: 'Recovery action under defaulted agricultural credit and collateral challenge.' },
    { name: 'Workers Union vs. Apex Logistics', description: 'Labor rights petition alleging unlawful termination and pending compensation.' },
    { name: 'Citizen Group vs. Water Board', description: 'Civic filing over supply contamination and emergency compliance directives.' }
];

// In-memory mock storage for offline mode
let mockCases = [];
let mockUsers = [];

function initializeMockData() {
    if (mockCases.length > 0) return; // Already initialized

    const today = getTodayIsoDate();
    mockCases = [];

    // Create 5 backlog cases
    for (let i = 1; i <= DAILY_SECTION_TARGET; i++) {
        mockCases.push({
            id: i * 2 - 1,
            caseNumber: `BP${String(i).padStart(3, '0')}`,
            category: 'backlog',
            status: 'pending',
            priority: i <= 2 ? 'high' : 'medium',
            caseName: BACKLOG_SEED[(i - 1) % BACKLOG_SEED.length].name,
            description: BACKLOG_SEED[(i - 1) % BACKLOG_SEED.length].description,
            actionDate: today
        });
    }

    // Create 5 fresh cases
    for (let i = 1; i <= DAILY_SECTION_TARGET; i++) {
        mockCases.push({
            id: i * 2,
            caseNumber: `FF${String(i).padStart(3, '0')}`,
            category: 'fresh',
            status: 'pending',
            priority: i <= 2 ? 'high' : 'medium',
            caseName: FRESH_SEED[(i - 1) % FRESH_SEED.length].name,
            description: FRESH_SEED[(i - 1) % FRESH_SEED.length].description,
            actionDate: today
        });
    }

    // Initialize mock users for offline testing
    mockUsers = [
        {
            id: 1,
            email: 'judge@test.com',
            role: 'JUDGE',
            status: 'VERIFIED',
            passwordHash: bcrypt.hashSync('password', 8)
        },
        {
            id: 2,
            email: 'lawyer@test.com',
            role: 'LAWYER',
            status: 'VERIFIED',
            passwordHash: bcrypt.hashSync('password', 8)
        }
    ];
}

function getTodayIsoDate(date = new Date()) {
    return date.toISOString().split('T')[0];
}

function parseCaseNumber(value) {
    const match = String(value || '').match(/(\d+)$/);
    return match ? Number(match[1]) : 0;
}

function toCaseDto(caseData, index) {
    return {
        id: caseData.caseNumber,
        sl: index + 1,
        name: caseData.caseName,
        description: caseData.description,
        status: caseData.status,
        category: caseData.category,
        actionDate: caseData.actionDate ? caseData.actionDate : ''
    };
}

// OFFLINE mode functions
function getVisibleCasesByCategory_Offline(category, forDate) {
    return mockCases
        .filter(c => c.category === category && c.status !== 'adjoined')
        .filter(c => !c.actionDate || c.actionDate <= forDate)
        .sort((a, b) => {
            const dateA = a.actionDate || '';
            const dateB = b.actionDate || '';
            if (dateA !== dateB) return dateA.localeCompare(dateB);
            return a.id - b.id;
        });
}

function toView_Offline(forDate) {
    const backlog = getVisibleCasesByCategory_Offline('backlog', forDate);
    const fresh = getVisibleCasesByCategory_Offline('fresh', forDate);

    return {
        date: forDate,
        backlog: backlog.map((c, idx) => toCaseDto(c, idx)),
        fresh: fresh.map((c, idx) => toCaseDto(c, idx)),
        counts: {
            backlog: backlog.length,
            fresh: fresh.length
        },
        allFinished: backlog.length === 0 && fresh.length === 0
    };
}

async function getDashboardView() {
    if (offlineMode) {
        initializeMockData();
        return toView_Offline(getTodayIsoDate());
    }
    // Keep original DB logic for when DB is available
    await ensureSeedData();
    const today = getTodayIsoDate();
    return toView(today);
}

async function updateCaseAction(caseNumber, action, actionDate, actor = 'judge') {
    const validActions = new Set(['adjoined', 'stay', 'rehearing']);
    if (!validActions.has(action)) {
        throw new Error('Invalid action. Use adjoined, stay, or rehearing.');
    }

    if (offlineMode) {
        const caseData = mockCases.find(c => c.caseNumber === caseNumber);
        if (!caseData) {
            throw new Error(`Case ${caseNumber} not found.`);
        }
        caseData.status = action;
        caseData.actionDate = actionDate;
        return toView_Offline(getTodayIsoDate());
    }

    // Keep original DB logic
    const caseData = await prisma.case.findUnique({
        where: { caseNumber }
    });
    if (!caseData) {
        throw new Error(`Case ${caseNumber} not found.`);
    }

    await prisma.case.update({
        where: { caseNumber },
        data: { status: action, actionDate: new Date(`${actionDate}T00:00:00.000Z`) }
    });

    const today = getTodayIsoDate();
    return toView(today);
}

async function loadNewCasesIfAllFinished() {
    if (offlineMode) {
        const view = toView_Offline(getTodayIsoDate());
        if (!view.allFinished) {
            return { ok: true, reason: 'Cases still pending; no load triggered.', view };
        }
        // Generate new cases
        const today = getTodayIsoDate();
        const seed = FRESH_SEED;
        const nextId = Math.max(...mockCases.map(c => c.id), 0) + 1;
        for (let i = 0; i < DAILY_SECTION_TARGET; i++) {
            mockCases.push({
                id: nextId + i,
                caseNumber: `NEW${String(nextId + i).padStart(3, '0')}`,
                category: 'fresh',
                status: 'pending',
                priority: i <= 1 ? 'high' : 'medium',
                caseName: seed[i % seed.length].name,
                description: seed[i % seed.length].description,
                actionDate: today
            });
        }
        const newView = toView_Offline(today);
        return { ok: true, reason: 'New batch loaded.', view: newView };
    }

    // Keep original DB logic
    const today = getTodayIsoDate();
    const view = await toView(today);
    if (!view.allFinished) {
        return { ok: true, reason: 'Cases still pending; no load triggered.', view };
    }
    await createGeneratedCases('fresh', DAILY_SECTION_TARGET, today);
    const newView = await toView(today);
    return { ok: true, reason: 'New batch loaded.', view: newView };
}

async function runNightlyRollover() {
    if (offlineMode) {
        // Mark all adjoined cases old
        mockCases.forEach(c => {
            if (c.status === 'adjoined') {
                c.actionDate = getTodayIsoDate(new Date(Date.now() - 86400000)); // Yesterday
            }
        });
        const view = toView_Offline(getTodayIsoDate());
        return { ok: true, changed: true, view };
    }

    // Keep original DB logic
    const yesterday = getTodayIsoDate(new Date(Date.now() - 86400000));
    const today = getTodayIsoDate();

    const adjoined = await prisma.case.findMany({
        where: { status: 'adjoined', actionDate: { gte: new Date(`${today}T00:00:00.000Z`) } }
    });

    if (adjoined.length === 0) {
        const view = await toView(today);
        return { ok: true, changed: false, view };
    }

    await prisma.case.updateMany({
        where: { status: 'adjoined', actionDate: { gte: new Date(`${today}T00:00:00.000Z`) } },
        data: { actionDate: new Date(`${yesterday}T00:00:00.000Z`) }
    });

    const view = await toView(today);
    return { ok: true, changed: true, view };
}

async function registerUser(opts = {}) {
    const { email, password, role = 'LAWYER', barCouncilId = '' } = opts;
    if (!email || !password) {
        throw new Error('email and password are required.');
    }

    if (offlineMode) {
        const existing = mockUsers.find(u => u.email === email);
        if (existing) {
            throw new Error('Email already registered.');
        }
        const newUser = {
            id: Math.max(...mockUsers.map(u => u.id), 0) + 1,
            email,
            role,
            status: 'PENDING',
            passwordHash: bcrypt.hashSync(password, 8),
            barCouncilId
        };
        mockUsers.push(newUser);
        // eslint-disable-next-line no-unused-vars
        const { passwordHash, ...safeUser } = newUser;
        return safeUser;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new Error('Email already registered.');
    }

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: bcrypt.hashSync(password, 8),
            role,
            status: 'PENDING',
            barCouncilId
        }
    });

    // eslint-disable-next-line no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
}

async function loginUser(email, password) {
    if (!email || !password) {
        throw new Error('email and password are required.');
    }

    if (offlineMode) {
        const user = mockUsers.find(u => u.email === email);
        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            throw new Error('Invalid email or password.');
        }
        // eslint-disable-next-line no-unused-vars
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw new Error('Invalid email or password.');
    }

    // eslint-disable-next-line no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
}

async function listPendingUsers() {
    if (offlineMode) {
        return mockUsers
            .filter(u => u.status === 'PENDING')
            .map(u => {
                // eslint-disable-next-line no-unused-vars
                const { passwordHash, ...safe } = u;
                return safe;
            });
    }

    const users = await prisma.user.findMany({
        where: { status: 'PENDING' },
        select: { id: true, email: true, role: true, barCouncilId: true }
    });
    return users;
}

async function verifyUserByAdmin(userId, barCouncilId = '') {
    if (offlineMode) {
        const user = mockUsers.find(u => u.id === Number(userId));
        if (!user) {
            throw new Error('User not found.');
        }
        user.status = 'VERIFIED';
        if (barCouncilId) {
            user.barCouncilId = barCouncilId;
        }
        // eslint-disable-next-line no-unused-vars
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(userId) }
    });
    if (!user) {
        throw new Error('User not found.');
    }

    const updated = await prisma.user.update({
        where: { id: Number(userId) },
        data: { status: 'VERIFIED', barCouncilId: barCouncilId || user.barCouncilId }
    });

    // eslint-disable-next-line no-unused-vars
    const { passwordHash, ...safeUser } = updated;
    return safeUser;
}

// Placeholder functions kept for DB-only logic
async function ensureSeedData() {
    if (offlineMode) return;
    // DB initialization logic here
}

module.exports = {
    getDashboardView,
    updateCaseAction,
    loadNewCasesIfAllFinished,
    runNightlyRollover,
    registerUser,
    loginUser,
    verifyUserByAdmin,
    listPendingUsers
};
