const Product = require('../models/product.model');

// Get all products from all vendors
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('vendor', 'storeName email location phone');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get products', error: err.message });
  }
};

// Search a product and return nearest vendor supplying it
const searchProductNearestVendor = async (req, res) => {
  try {
    const { name, lat, lng } = req.query;

    if (!name || !lat || !lng) {
      return res.status(400).json({ message: 'Product name, latitude, and longitude are required' });
    }

    const products = await Product.find({
      name: { $regex: name, $options: 'i' },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)] // [longitude, latitude]
          },
          $maxDistance: 10000 // 10 km radius (optional)
        }
      }
    }).populate('vendor', 'storeName phone location');

    if (!products.length) {
      return res.status(404).json({ message: 'No product found nearby' });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};



module.exports = {
  getAllProducts,
  searchProductNearestVendor
};
