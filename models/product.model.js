const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, enum: ['kg', 'pieces'], required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },

  // ✅ GeoJSON-compliant location field for geospatial search
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // Format: [longitude, latitude]
      required: true
    }
  },

  createdAt: { type: Date, default: Date.now }
});

// ✅ Add 2dsphere index for geospatial queries
ProductSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Product', ProductSchema);
