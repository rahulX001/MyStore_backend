const express = require('express');
const router = express.Router();
const { registerUser, loginUser, purchaseProduct ,getOrderHistory,getNearbyProducts} = require('../controllers/user.controller');
const { jwtAuthMiddlware } = require('../auth/auth');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Route
router.post('/purchase', jwtAuthMiddlware, purchaseProduct);
router.get('/orders/history', jwtAuthMiddlware, getOrderHistory);
router.get('/products/nearby', getNearbyProducts);



module.exports = router;
