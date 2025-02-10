const express = require('express');
const companyController = require('../controllers/companyController');
const multer = require('multer');

const router = express.Router();

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
  

// router.post('/uploaddata', companyController.createCompany);
router.post('/create', companyController.createCompany);
// router.post('/uploaddata', upload, companyController.createCompany);
router.get('/', companyController.getCompanies);
router.put('/update/:id',companyController.updateCompany);
router.delete('/delete/:id', companyController.deleteCompany);
router.get('/getSpecificCompany/:id', companyController.getSpecificCompany);

module.exports = router;
