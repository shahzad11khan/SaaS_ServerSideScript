const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const Company = require('../models/Company')

// Login Controller
exports.forGotPassword = async (req, res) => {
    try {
    const { email, password, confirmPassword } = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'Email , password and confirmPassword are required' });
       }
    let user = await User.findOne({$and: [{ email: email }, { confirmPassword: password }]});
    if (!user) {
      user = await Company.findOne({$and: [{ email: email }, { confirmPassword: password }]});
    }
    if(user.email !== email) return res.status(400).json({ error: 'InCorrect Email' });
    if(password !== confirmPassword) return res.status(400).json({ error: 'Password And ConfirmPassword Not Matched' });
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error: 'Password must be at least 4 characters long, include one uppercase letter, one digit, and one special character',
        });
    }
    user.password = password;
    user.confirmPassword = confirmPassword;

    await user.save();

  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};
