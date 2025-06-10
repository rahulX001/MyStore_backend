const Vendor = require('../models/vendor.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const { generateToken } = require('../auth/auth');

// Vendor Signup
const signup = async (req, res) => {
  try {

    const { email, phone } = req.body;

    // ✅ Check for existing vendor by email or phone
    const existingVendor = await Vendor.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingVendor) {
      return res.status(400).json({ message: 'Vendor already exists with this email or phone' });
    }

    const vendor = new Vendor(req.body);
    await vendor.save();

    res.status(201).json({ message: 'Vendor registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};


// Vendor Login
const login = async (req, res) => {
  try {
    const { email, Password } = req.body;
    const vendor = await Vendor.findOne({ email });

    if (!vendor || !(await vendor.comparePassword(Password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: vendor._id, role: 'vendor' });
    res.json({ token, vendor });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// List products of logged-in vendor
const listProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get products', error: err.message });
  }
};

// Add Product
const addProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      vendor: req.user.id,
    });
    await product.save();
    res.status(201).json({ message: 'Product added', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product', error: err.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const {productId } = req.params;
    const updated = await Product.findOneAndUpdate(
      { _id: productId, vendor: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', updated });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { productId} = req.params;
    const deleted = await Product.findOneAndDelete({ _id: productId, vendor: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
};

// Who ordered vendor’s products
const buyersOfVendor = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.id })
      .populate('buyer', 'name email')
      .populate('product');
     if(orders.length==0) return res.status(202).json({ message: 'No buyers found' }); 
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch buyers', error: err.message });
  }
};
// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const vendorId = req.user.id; // from auth middleware
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findOne({ _id: orderId, vendor: vendorId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found or not authorized' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
};

module.exports = {
  signup,
  login,
  listProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  buyersOfVendor,
  updateOrderStatus
};
