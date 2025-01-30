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
      userLogoPublicId
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
      // Destructure query parameters
      const { page = 1, limit = 10, sortBy = 'userName', order = 'asc', search = '' } = req.query;
  
      // Convert sort order to 1 for ASC and -1 for DESC
      const sortOrder = order === 'desc' ? -1 : 1;
  
      // Build the query to match search term (if provided)
      const searchQuery = search
        ? { $or: [{ email: { $regex: search, $options: 'i' } },{ username: { $regex: search, $options: 'i' } }, { fullName: { $regex: search, $options: 'i' } }] }
        : {}; // Search by company name or registration number
  
      // Aggregation pipeline
      const user = await User.aggregate([
        { $match: searchQuery }, // Search filter
        { $sort: { [sortBy]: sortOrder } }, // Sorting
        { $skip: (page - 1) * limit }, // Pagination: skip results based on current page
        { $limit: parseInt(limit) }, // Pagination: limit number of results per page
      ]);
  
      // Count total number of companies (without pagination)
      const userCount = await User.aggregate([
        { $match: searchQuery }, // Match search filter
        { $count: "totalUsers" } // Count the total number of companies
      ]);
  
      res.status(200).json({
        user,
        userCount: userCount.length > 0 ? userCount[0].totalUsers : 0,
        currentPage: parseInt(page),
        totalPages: Math.ceil(userCount.length > 0 ? userCount[0].totalUsers / limit : 1)
      });
  
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
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
    if (existingUser) {
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

    const user = new User.findByIdAndUpdate(id,{
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
