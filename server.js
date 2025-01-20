require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');

const path = require('path');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

app.use(fileUpload({
  useTempFiles : true,
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/companies', companyRoutes);
app.use('/api/user', userRoutes);

// Serve static HTML for testing APIs (optional)
app.use(express.static(path.join(__dirname, 'public'))); // Serve files from public folder

// Fallback route for undefined paths to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

