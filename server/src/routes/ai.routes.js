const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/ai.controller');
router.post('/chat', requireAuth, ctrl.chat);
router.get('/chat/history', requireAuth, ctrl.getChatHistory);
router.delete('/chat/history', requireAuth, ctrl.clearChatHistory);
router.post('/recommendations', requireAuth, ctrl.getMealRecommendations);
router.post('/analyze-image', requireAuth, ctrl.analyzeImage);
module.exports = router;
