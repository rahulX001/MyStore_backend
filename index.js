const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const vendorRoutes = require('./routes/vendor.routes');
const productRoutes = require('./routes/product.routes');
require('dotenv').config();
require('./config/db');
// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));