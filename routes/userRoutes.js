// routes/userRoutes.js

const express = require('express');
const { signup, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { login } = require('../controllers/authController');
const { generateResetToken,resetPassword } = require('../controllers/resetpasswordauthController');
const {authMiddleware} = require('../middlewares/authMiddleware')
const router = express.Router();

// Login 
router.post('/login',login)
// Signup 
router.post('/signup', signup);
// CRUD routes
router.get('/users', getUsers);
router.get('/user/:id', getUserById);
router.put('/user/:id', updateUser);
router.delete('/user/:id',authMiddleware(["superadmin","admin","manager"]), deleteUser);
// rest password
router.post('/forget-password', generateResetToken);
router.post('/reset-password', resetPassword);
module.exports = router;
