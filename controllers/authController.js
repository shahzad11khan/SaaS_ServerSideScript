const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const Company = require('../models/Company')

// Login Controller
exports.login = async (req, res) => {
    try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
       }
    let user = await User.findOne({$and: [{ email: email }, { confirmPassword: password }]});
    // let isCompany=null;
    // if (!user) {
    //   isCompany = await Company.findOne({ email: email });
    //   if(!isCompany) return res.status(400).json({ message: 'InCorrect Email' });
    //   user = isCompany;
    // }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)  return res.status(400).json({ message: 'InCorrect password' });
    if(user.status === 'inactive') return res.status(400).json({message:'User Is InActive'})
    const token = jwt.sign({ userId: user._id, userEmail:user.email,userName:user.username, permissions:user.permission , userImage:user.userLogoUrl, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1y' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};
