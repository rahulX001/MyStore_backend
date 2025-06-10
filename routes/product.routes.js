const express = require('express');
const router = express.Router();
const { getAllProducts, searchProductNearestVendor } = require('../controllers/product.controller');

// Get all products from all vendors
router.get('/', getAllProducts);

// Search a product by name and get nearest vendor
router.get('/search', searchProductNearestVendor);

module.exports = router;
