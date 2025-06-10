const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  listProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  buyersOfVendor,
   updateOrderStatus
} = require('../controllers/vendor.controller');

const { jwtAuthMiddlware } = require('../auth/auth');

// Vendor signup
router.post('/signup', signup);

// Vendor login
router.post('/login', login);

// List all vendor products (auth required)
router.get('/products', jwtAuthMiddlware, listProducts);

// Add a new product (auth required)
router.post('/products', jwtAuthMiddlware, addProduct);

// Update a product by ID (auth required)
router.put('/products/:productId', jwtAuthMiddlware, updateProduct);

// Delete a product by ID (auth required)
router.delete('/products/:productId', jwtAuthMiddlware, deleteProduct);

// See buyers who purchased vendor's products (auth required)
router.get('/buyers', jwtAuthMiddlware, buyersOfVendor);
router.put('/orders/:orderId/status', jwtAuthMiddlware,  updateOrderStatus);


module.exports = router;
