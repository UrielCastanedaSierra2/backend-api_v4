import { Router } from 'express';
const router = Router();

// ─────────────────────────────────────────────────────────────
// PING: GET src/routes/pingPublic.routes.js
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/ping-public
 * Endpoint público (NO requiere API Key).
 * Útil para probar conectividad/CORS desde Power Apps u orígenes de desarrollo.
 */
router.get('/', (req, res) => {
  return res.json({ ok: true, msg: 'pong (public)' });
});

export default router;