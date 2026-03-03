const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

// Все админские маршруты теперь защищены
router.post('/products', authMiddleware, productController.createProduct);
router.put('/products/:id', authMiddleware, productController.updateProduct);
router.delete('/products/:id', authMiddleware, productController.deleteProduct);
router.patch('/products/:id/stock', authMiddleware, productController.updateStock);

module.exports = router;