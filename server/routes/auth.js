const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Публичные маршруты
router.post('/register', authController.register);
router.post('/login', authController.login);

// Защищенные маршруты
router.get('/verify', authMiddleware, authController.verifyToken);

module.exports = router;