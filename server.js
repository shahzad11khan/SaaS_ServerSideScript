require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const deliveredRoutes = require('./routes/deliveredProRoutes');
const receivePayRoutes = require('./routes/receivedPaymentRoutes');
const messagingRoutes = require('./routes/messagingRoutes');
const onhandRoutes = require('./routes/onhandRoutes');
const tagManagementRoutes = require('./routes/tagManagementRutes');
const stockManagementRoutes = require('./routes/stockRoutes');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
const tempDir = "/tmp/";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir: tempDir,
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',  
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/tag', tagManagementRoutes);
app.use('/api/stock', stockManagementRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/permission', permissionRoutes);
app.use('/api/delivered', deliveredRoutes);
app.use('/api/receive', receivePayRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/onhand', onhandRoutes);
// server.js

// Serve static HTML for testing APIs (optional)
app.use(express.static(path.join(__dirname, 'public'))); // Serve files from public folder

// Fallback route for undefined paths to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

