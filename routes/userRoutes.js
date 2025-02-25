// routes/userRoutes.js

const express = require('express');
const { signup, getUsers, getUserById, updateUser, deleteUser, userSignup } = require('../controllers/userController');
const { login } = require('../controllers/authController');
const { generateResetToken,resetPassword,verifyOTP } = require('../controllers/resetpasswordauthController');
const {authMiddleware} = require('../middlewares/authMiddleware')
const {companyMiddleware} = require('../middlewares/companyMiddleware.js')
const router = express.Router();

// Login 
router.post('/login',login)
// Signup 
router.post('/signup',companyMiddleware,  signup);
router.post('/user_signup',  userSignup);
// CRUD routes
router.get('/users', getUsers);
router.get('/user/:id', getUserById);
router.put('/update/:id', updateUser);
router.delete('/delete/:id',authMiddleware(["superadmin","admin","manager"]), deleteUser);
// rest password
router.post('/forget-password', generateResetToken);
router.post('/verifyOTP', verifyOTP);
router.post('/reset-password', resetPassword);
module.exports = router;
