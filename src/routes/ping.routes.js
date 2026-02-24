import { Router } from 'express';
const router = Router();

// ─────────────────────────────────────────────────────────────
// PING: GET /api/ping
// ─────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
    res.json({ ok: true, msg: 'pong' });
});

export default router;
