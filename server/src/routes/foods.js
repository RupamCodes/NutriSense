const express = require('express');
const authenticate = require('../middleware/auth');
const { searchFoods, getFoodById, createCustomFood } = require('../controllers/foods.controller');
const router = express.Router();
router.use(authenticate);
router.get('/search', searchFoods);
router.get('/:id', getFoodById);
router.post('/custom', createCustomFood);
module.exports = router;
