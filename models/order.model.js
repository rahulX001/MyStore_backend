const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  totalPrice: { type: Number, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  // paymentMethod: {
  //   type: String,
  //   enum: ['credit_card', 'paypal', 'bank_transfer'],
  //   required: true
  // },
  // paymentStatus: {
  //   type: String,
  //   enum: ['pending', 'completed', 'failed'],
  //   default: 'pending'
  // },
  // trackingNumber: { type: String, unique: true, sparse: true },
  // trackingUrl: { type: String, unique: true, sparse: true },
  // notes: { type: String, default: '' },

  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;