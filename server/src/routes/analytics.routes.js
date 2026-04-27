const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/analytics.controller');
router.get('/daily', requireAuth, ctrl.getDailySummary);
router.get('/weekly', requireAuth, ctrl.getWeeklySummary);
router.get('/monthly', requireAuth, ctrl.getMonthlySummary);
router.get('/macros', requireAuth, ctrl.getMacroBreakdown);
router.get('/trends', requireAuth, ctrl.getTrends);
module.exports = router;
