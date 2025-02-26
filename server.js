// require('dotenv').config();
// const express = require('express');
// const connectDB = require('./config/db');
// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const companyRoutes = require('./routes/companyRoutes');
// const userRoutes = require('./routes/userRoutes');
// const permissionRoutes = require('./routes/permissionRoutes');
// const receivePayRoutes = require('./routes/receivedPaymentRoutes');
// const messagingRoutes = require('./routes/messagingRoutes');
// const onhandRoutes = require('./routes/onhandRoutes');
// const tagManagementRoutes = require('./routes/tagManagementRutes');
// const stockManagementRoutes = require('./routes/stockRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');
// const warehouseRoutes = require('./routes/warehouseRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const { getGeminiResponse } = require("./routes/geminiServiceRoute");
// const http = require("http");
// const { Server } = require("socket.io");
// const fs = require('fs');
// const path = require('path');
// const fileUpload = require('express-fileupload');
// const cors = require('cors');
// const app = express();
// const tempDir = "/tmp/";
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true });
// }
// app.use(fileUpload({
//   useTempFiles : true,
//   tempFileDir: tempDir,
//   limits: { fileSize: 50 * 1024 * 1024 },
// }));

// // Middleware
// const server = http.createServer(app);
// app.use(express.json());
// app.use(cors({
//   origin: '*',  
// }));

// // io
// // Set up Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// app.set("io", io);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Connect to MongoDB
// connectDB();


// // Serve static HTML for testing APIs (optional)
// app.use(express.static(path.join(__dirname, 'public'))); // Serve files from public folder

// // Fallback route for undefined paths to serve index.html
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });


// // API Routes
// app.use('/api/companies', companyRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/tag', tagManagementRoutes);
// app.use('/api/stock', stockManagementRoutes);
// app.use('/api/category', categoryRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/warehouse', warehouseRoutes);
// app.use('/api/permission', permissionRoutes);
// app.use('/api/receive', receivePayRoutes);
// app.use('/v1/api/notification', messagingRoutes);
// app.use('/api/onhand', onhandRoutes);
// app.use('/api/payment', paymentRoutes);
// app.post("/chat", async (req, res) => {
//   const { data } = req.body;
// console.log(data)
//   if (!data) {
//     return res.status(400).json({ error: "User query is required" });
//   }

//   try {
//     const geminiResponse = await getGeminiResponse(data);
//     res.json({ response: geminiResponse });
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred while processing your request" });
//   }
// });
// // server.js

// // socket.io
// const handleSockets = require("./services/socketHandler");
// handleSockets(io);
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const os = require("os");
const http = require("http");
const { Server } = require("socket.io");


const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const receivePayRoutes = require('./routes/receivedPaymentRoutes');
const messagingRoutes = require('./routes/messagingRoutes');
const onhandRoutes = require('./routes/onhandRoutes');
const tagManagementRoutes = require('./routes/tagManagementRutes');
const stockManagementRoutes = require('./routes/stockRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { getGeminiResponse } = require("./routes/geminiServiceRoute");

const app = express();
const server = http.createServer(app);

// ✅ Setup Temporary File Storage (Cross-Platform)
const tempDir = os.tmpdir();
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: tempDir,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  })
);

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Serve Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public"))); // Serve files from public folder
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ MongoDB Connection
connectDB();

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin:"*",
    methods: ["GET", "POST"],
  },
});
app.set("io", io);

// ✅ Handle Sockets (Move Logic to Separate File)
const handleSockets = require("./services/socketHandler");
console.log('handle socket is running')
handleSockets(io);

// ✅ API Routes
app.use("/api/companies", companyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tag", tagManagementRoutes);
app.use("/api/stock", stockManagementRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/permission", permissionRoutes);
app.use("/api/receive", receivePayRoutes);
app.use("/v1/api/notification", messagingRoutes);
app.use("/api/onhand", onhandRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Chat Route (Calls Gemini Service)
app.post("/chat", async (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: "User query is required" });
  }

  try {
    const geminiResponse = await getGeminiResponse(data);
    res.json({ response: geminiResponse });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
