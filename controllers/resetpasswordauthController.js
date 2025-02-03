const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter (e.g., for Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Use SSL for secure connection
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Error:', error);
  } else {
    console.log('SMTP connected:', success);
  }
});

// Generate a Password Reset Token
exports.generateResetToken = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token
    const resetToken = user.generateRefreshToken();
    await user.save();

    // Construct the password reset URL
    let resetURL;
    if (['superadmin', 'admin', 'manager'].includes(user.role)) {
      resetURL = `${process.env.CLIENT_URL_ADMIN}/reset-password/${resetToken}`;
    } else if (user.role === 'user') {
      resetURL = `${process.env.CLIENT_URL_USER}/reset-password/${resetToken}`;
    } else {
      resetURL = `${process.env.CLIENT_URL_MOBILE}/reset-password/${resetToken}`;
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetURL}`,
      html: `<p>You requested a password reset. Please click the link below to reset your password:</p><a href="${resetURL}" target="_blank">${resetURL}</a>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email Sending Error:', error);
        return res.status(500).json({ message: 'Failed to send email', error: error.message });
      }
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Password reset link sent to your email', email, resetURL });
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Find the user by the refresh token
    const user = await User.findOne({ refreshToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update the user's password
    user.password = await bcrypt.hash(newPassword, 10);
    user.confirmPassword = newPassword;

    // Clear the refresh token after successful password reset
    user.clearRefreshToken();
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
