const express = require('express');
const { signup, login, googleLogin, refresh, logout } = require('../controllers/auth.controller');
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
module.exports = router;
