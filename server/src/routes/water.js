const express = require('express');
const authenticate = require('../middleware/auth');
const { getTodayWater, logWater } = require('../controllers/water.controller');
const router = express.Router();
router.use(authenticate);
router.get('/today', getTodayWater);
router.post('/log', logWater);
module.exports = router;
