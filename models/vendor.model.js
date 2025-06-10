const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  storeName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
   Password:{
    type:String,
    required:true, 
  },
  address: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  gstNumber: {
    type: String,
    trim: true
  },
  panNumber: {
    type: String,
    trim: true
  },
  bankDetails: {
    accountName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    ifscCode: { type: String, trim: true },
    bankName: { type: String, trim: true },
    branch: { type: String, trim: true }
  },
  productsSupplied: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  indexes: [
    { key: { location: '2dsphere' } }
  ]
});
VendorSchema.pre('save',async function(next)
{
  if(!this.isModified())return next();
  const salt=await bcrypt.genSalt(10);
  this.Password=await bcrypt.hash(this.Password,salt);
  next();
}) 
VendorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.Password);
}; 
module.exports = mongoose.model('Vendor', VendorSchema);