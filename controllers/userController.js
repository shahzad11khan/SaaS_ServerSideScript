const uploadImageToCloudinary = require('../middlewares/cloudinary');
const { deleteFromCloudinary } = require('../middlewares/deleteFromCloudinary');
const User = require('../models/User');

// Signup Controller
exports.signup = async (req, res) => {
  try {
    // console.log(req.body)
    // console.log(req.files.userLogo)
    const { fullName, username, email, password, confirmPassword,status, dateOfBirth, permission, role } = req.body;
    const file  = req.files.userLogo
    console.log(file , req.body)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
    let userLogoUrl = '';
    let userLogoPublicId = '';
    const existingUser = await User.findOne({ email  });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or Username already exists' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error: 'Password must be at least 4 characters long, include one uppercase letter, one digit, and one special character',
        });
    }
    if (new Date(dateOfBirth) > new Date()) {
        return res.status(400).json({ error: 'Date of birth cannot be in the future.' });
    }
    if (!dateOfBirth || !/^\d{2}-\d{2}-\d{4}$/.test(dateOfBirth)) {
      return res.status(400).json({ error: "Invalid date format. Use DD-MM-YYYY" });
    }

    // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD'
    const [day, month, year] = dateOfBirth.split("-");
    const formattedDate = `${year}-${month}-${day}`;

    const dob = new Date(formattedDate);

    if (isNaN(dob.getTime())) {
      return res.status(400).json({ error: "Invalid date provided" });
    }
    if (file) {
        const result = await uploadImageToCloudinary(file.tempFilePath);
        userLogoUrl = result.url;
        userLogoPublicId = result.public_id;
    } else {
        userLogoUrl = null;
        userLogoUrl = null;
    }



    const user = new User({
      fullName,
      username,
      email,
      password,
      confirmPassword,
      dateOfBirth : dob,
      permission,
      status,
      role,
      userLogoUrl,
      userLogoPublicId,
      companyId:req.company.id,
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    // Fetch all users and populate company details
    const users = await User.find().populate('companyId', 'companyName');
    console.log(users);
    
    // Count total users
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users,
      userCount: totalUsers
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
  const { id } = req.params;  
  const { fullName, username, email, password, confirmPassword,status, dateOfBirth, permission, role } = req.body;
  const file  = req.files.userLogo
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
  let userLogoUrl = null;
  let userLogoPublicId = null;

    const findUser = await User.findById(id)
    if(!findUser) return res.status(404).json({Message:"User Not Exists"})

    const existingUser = await User.findOne({ email  });
    if (existingUser._id.toString() !== id) {
        if (existingUser.email === email) {
            return res.status(400).json({ error: 'User with this email already exists' });
          }  
      }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error: 'Password must be at least 4 characters long, include one uppercase letter, one digit, and one special character',
        });
    }
    if (new Date(dateOfBirth) > new Date()) {
        return res.status(400).json({ error: 'Date of birth cannot be in the future.' });
    }
    if (!dateOfBirth || !/^\d{2}-\d{2}-\d{4}$/.test(dateOfBirth)) {
      return res.status(400).json({ error: "Invalid date format. Use DD-MM-YYYY" });
    }

    // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD'
    const [day, month, year] = dateOfBirth.split("-");
    const formattedDate = `${year}-${month}-${day}`;

    const dob = new Date(formattedDate);

    if (isNaN(dob.getTime())) {
      return res.status(400).json({ error: "Invalid date provided" });
    }
    if (file) {
        await deleteFromCloudinary(findUser.userLogoPublicId);
        const result = await uploadImageToCloudinary(file.tempFilePath);
        userLogoUrl = result.url;
        userLogoPublicId = result.public_id;
    } else {
        userLogoUrl = findUser.userLogoUrl;
        userLogoPublicId = findUser.userLogoPublicId;
    }

    const user = User.findByIdAndUpdate(id,{
      fullName,
      username,
      email,
      password,
      confirmPassword,
      dateOfBirth:dob,
      permission,
      status,
      role,
      userLogoUrl,
      userLogoPublicId
    },{
      new : true
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
        message: 'User updated successfully',
        user: user,
      });
    } catch (error) {
      console.log(error)
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await deleteFromCloudinary(company.userLogoPublicId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};
