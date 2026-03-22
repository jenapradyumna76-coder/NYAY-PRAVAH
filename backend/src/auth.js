const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = '12h';

function getJwtSecret() {
    return process.env.JWT_SECRET || 'change-me-in-env';
}

function issueToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role,
            status: user.status
        },
        getJwtSecret(),
        { expiresIn: JWT_EXPIRES_IN }
    );
}

function authenticateToken(req, res, next) {
    // In offline mode, bypass authentication
    if (process.env.OFFLINE_MODE === 'true' || process.env.NODE_ENV === 'offline') {
        req.user = { sub: 1, email: 'demo@test.com', role: 'JUDGE', status: 'VERIFIED' };
        return next();
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        // In offline testing, allow empty token
        if (!process.env.JWT_SECRET) {
            req.user = { sub: 1, email: 'demo@test.com', role: 'JUDGE', status: 'VERIFIED' };
            return next();
        }
        return res.status(401).json({ ok: false, error: 'Missing bearer token.' });
    }

    try {
        const payload = jwt.verify(token, getJwtSecret());
        req.user = payload;
        return next();
    } catch (error) {
        return res.status(401).json({ ok: false, error: 'Invalid or expired token.' });
    }
}

function isAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ ok: false, error: 'Unauthorized.' });
    }

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ ok: false, error: 'Admin access required.' });
    }

    if (req.user.status !== 'VERIFIED') {
        return res.status(403).json({ ok: false, error: 'Admin account is not verified.' });
    }

    return next();
}

module.exports = {
    issueToken,
    authenticateToken,
    isAdmin
};
