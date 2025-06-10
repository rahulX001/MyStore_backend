const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { generateToken } = require('../auth/auth');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',         // replace with your Gmail
    pass: 'your_app_password'             // replace with your Gmail app password
  }
});
// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, number, Password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = new User({ name, email, number, Password});
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, Password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(Password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: user._id});
    res.json({ token, user: { id: user._id, name: user.name, email: user.email} });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Purchase Product from Vendor
const purchaseProduct = async (req, res) => {
  try {
    const { vendorId, productId, quantity, shippingAddress } = req.body;

    // Validate vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // Validate product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    // Reduce stock
    product.quantity -= quantity;
    await product.save();

    // Calculate total price
    const totalPrice = product.price * quantity;

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      return res.status(400).json({ message: 'Incomplete shipping address' });
    }

    // Create order
    const order = new Order({
      buyer: req.user.id,
      vendor: vendor._id,
      product: product._id,
      quantity,
      totalPrice,
      shippingAddress // expects object with street, city, state, zipCode
    });

    await order.save();

    res.status(201).json({ message: 'Purchase successful', order });
  } catch (err) {
    res.status(500).json({ message: 'Purchase failed', error: err.message });
  }
};


// const buyProduct = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     const userId = req.user.id;

//     // Find product
//     const product = await Product.findById(productId).populate('vendor');
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Check stock
//     if (product.quantity < quantity) {
//       return res.status(400).json({ message: 'Insufficient stock' });
//     }

//     // Deduct stock
//     product.quantity -= quantity;
//     await product.save();

//     // Create order
//     const order = new Order({
//       buyer: userId,
//       vendor: product.vendor._id,
//       product: product.name,
//       quantity
//     });
//     await order.save();

//     // Get user info
//     const user = await User.findById(userId);

//     // Send email confirmation
//     const mailOptions = {
//       from: 'your_email@gmail.com',
//       to: user.email,
//       subject: 'Order Confirmation',
//       text: `Hello ${user.name},\n\nYou have successfully purchased ${quantity} ${product.unit} of "${product.name}" from ${product.vendor.storeName}.\n\nThank you for shopping with us!\n\n- Your Store Team`
//     };

//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.error('Email sending failed:', err);
//       } else {
//         console.log('Email sent:', info.response);
//       }
//     });

//     res.status(200).json({ message: 'Order placed successfully', order });

//   } catch (error) {
//     console.error('Buy product error:', error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };

const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ buyer: userId })
      .populate('product', 'name price unit').populate('vendor', 'storeName email location phone')
      .sort({ createdAt: -1 }); // Sort by most recent orders

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order history', error: err.message });
  }
};
const getNearbyProducts = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) return res.status(400).json({ message: "Latitude and Longitude required" });

    // Radius in radians = km / Earth radius (6378.1)
    const radiusInRadians = radius / 6378.1;

    const products = await Product.find({
      location: {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians]
        }
      }
    }).populate('vendor');

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Location search failed', error: err.message });
  }
};


module.exports = { registerUser, loginUser, purchaseProduct,getOrderHistory ,getNearbyProducts};
