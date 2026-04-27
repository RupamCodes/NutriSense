const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/nutrition.controller');
router.get('/search', requireAuth, ctrl.searchFood);
router.get('/barcode/:barcode', requireAuth, ctrl.lookupBarcode);
router.post('/natural', requireAuth, ctrl.parseNaturalLanguage);
module.exports = router;
