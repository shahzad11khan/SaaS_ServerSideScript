const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
const {authMiddleware} = require('../middlewares/authMiddleware')


// Define storage and file filter options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Set the upload folder path
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Generate a unique file name
    }
  });
  
  // Middleware to handle file uploads
  const upload = multer({
    storage: storage,
  }).single('companyLogo'); // 'file' should match the field name used in the frontend
  

// Routes
router.post('/addproduct',authMiddleware(["superadmin","admin","manager","user"]), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id',authMiddleware(["superadmin","admin","manager","user"]), productController.getProductById);
router.put('/update/:id',authMiddleware(["superadmin","admin","manager","user"]), productController.updateProduct);
router.delete('/delete/:id',authMiddleware(["superadmin","admin","manager","user"]), productController.deleteProduct);

module.exports = router;
