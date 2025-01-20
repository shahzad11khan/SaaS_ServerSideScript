const uploadImageToCloudinary = require('../middlewares/cloudinary'); 
const { deleteFromCloudinary } = require('../middlewares/deleteFromCloudinary');
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
// const fs = require('fs');
exports.createCompany = async (req, res) => {
  try {
    // Destructure values from req.body
    const {
      companyName,
      registrationNumber,
      email,
      address,
      password,
      confirmPassword,
      phoneNumber,
      VatNumber,
      ownerName,
      ownerEmail,
      ownerPhoneNumber,
      businessLicense,
      taxId,
      businessType,
      businessAddress,
      isActive,
    } = req.body;
    // console.log(req.body)
    // console.log(req.files);
    const file  = req.files.companyLogo
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
    let companyLogoUrl = '';
    let companyLogoPublicId = '';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingCompany = await Company.findOne({
      $or: [
        { email: email }, 
        { registrationNumber: registrationNumber },
        { businessLicense: businessLicense },
      ],
    });
    
    if (existingCompany) {
      if (existingCompany.email === req.body.email) {
        return res.status(400).json({ error: 'Company with this email already exists' });
      }
      if (existingCompany.registrationNumber === req.body.registrationNumber) {
        return res.status(400).json({ error: 'Company with this registration number already exists' });
      }
      if (existingCompany.businessLicense === businessLicense) {
        return res.status(400).json({ error: 'Company with this businessLicense number already exists' });
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

    if (file) {
      const result = await uploadImageToCloudinary(file.tempFilePath);
      companyLogoUrl = result.url;
      companyLogoPublicId = result.public_id;
    } else {
      companyLogoUrl = null;
      companyLogoPublicId = null;
    }
    const newCompany = new Company({
      companyName,
      registrationNumber,
      email,
      address,
      password: hashedPassword,
      confirmPassword,
      phoneNumber,
      VatNumber,
      ownerName,
      ownerEmail,
      ownerPhoneNumber,
      businessLicense,
      taxId,
      businessType,
      businessAddress,
      isActive,
      companyLogo: companyLogoUrl,
      companyLogoPublicId: companyLogoPublicId
    });
    const savedCompany = await newCompany.save();
    res.status(201).json({
      message: 'Company created successfully',
      company: savedCompany,
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ message: 'Error creating company', error: error.message });
  }
};


// Function to update company details
exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;  
    const { companyName, registrationNumber, email, address, password, phoneNumber, VatNumber, ownerName, ownerEmail, ownerPhoneNumber, businessLicense, taxId, businessType, businessAddress, isActive } = req.body;
    const file  = req.files.companyLogo
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
    let updatedCompanyLogo = null;
    let updatedCompanyLogoPublicId = null;
    const hashedPassword = await bcrypt.hash(password, 10);

    const findCompany = await Company.findById(id)
    if(!findCompany) return res.status(404).json({Message:"Company Not Exists"})

    const existingCompany = await Company.findOne({
      $or: [
        { email: email }, 
        { registrationNumber: registrationNumber },
        { businessLicense: businessLicense },
        { ownerEmail: ownerEmail },
      ],
    });
    
    if (existingCompany) {
      if (existingCompany.email === email) {
        return res.status(400).json({ error: 'Company with this email already exists' });
      }
      if (existingCompany.registrationNumber === registrationNumber) {
        return res.status(400).json({ error: 'Company with this registration number already exists' });
      }
      if (existingCompany.businessLicense === businessLicense) {
        return res.status(400).json({ error: 'Company with this businessLicense number already exists' });
      }
      if (existingCompany.ownerEmail === ownerEmail) {
        return res.status(400).json({ error: 'Company with this Owner Email already In Use' });
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

    if (file) {
      await deleteFromCloudinary(findCompany.companyLogoPublicId);
      const result = await uploadImageToCloudinary(file.tempFilePath);
      updatedCompanyLogo = result.secure_url;
      updatedCompanyLogoPublicId = result.public_id;
    
    }else{
      updatedCompanyLogo = findCompany.companyLogo;
      updatedCompanyLogoPublicId = findCompany.companyLogoPublicId;
    }


    // Update the company in the database
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      {
        companyName,
        registrationNumber,
        email,
        address,
        password:hashedPassword,
        phoneNumber,
        VatNumber,
        ownerName,
        ownerEmail,
        ownerPhoneNumber,
        businessLicense,
        taxId,
        businessType,
        businessAddress,
        isActive,
        companyLogo: updatedCompanyLogo , 
        companyLogoPublicId: updatedCompanyLogoPublicId , 
      },
      { new: true } 
    );

    res.status(200).json({
      message: 'Company updated successfully',
      company: updatedCompany,
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ message: 'Error updating company', error: error.message });
  }
};


// Get all companies
// exports.getCompanies = async (req, res) => {
//   try {
//     const companyCount = await Company.aggregate([
//       { $count: "totalCompanies" } 
//     ]);
//     const companies = await Company.find();

//     res.status(200).json({
//       companies,
//       companyCount: companyCount.length > 0 ? companyCount[0].totalCompanies : 0 // Add count to the response
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching companies', error });
//   }
// };

exports.getCompanies = async (req, res) => {
  try {
    // Destructure query parameters
    const { page = 1, limit = 10, sortBy = 'companyName', order = 'asc', search = '' } = req.query;

    // Convert sort order to 1 for ASC and -1 for DESC
    const sortOrder = order === 'desc' ? -1 : 1;

    // Build the query to match search term (if provided)
    const searchQuery = search
      ? { $or: [{ email: { $regex: search, $options: 'i' } },{ companyName: { $regex: search, $options: 'i' } }, { registrationNumber: { $regex: search, $options: 'i' } }] }
      : {}; // Search by company name or registration number

    // Aggregation pipeline
    const companies = await Company.aggregate([
      { $match: searchQuery }, // Search filter
      { $sort: { [sortBy]: sortOrder } }, // Sorting
      { $skip: (page - 1) * limit }, // Pagination: skip results based on current page
      { $limit: parseInt(limit) }, // Pagination: limit number of results per page
    ]);

    // Count total number of companies (without pagination)
    const companyCount = await Company.aggregate([
      { $match: searchQuery }, // Match search filter
      { $count: "totalCompanies" } // Count the total number of companies
    ]);

    res.status(200).json({
      companies,
      companyCount: companyCount.length > 0 ? companyCount[0].totalCompanies : 0,
      currentPage: parseInt(page),
      totalPages: Math.ceil(companyCount.length > 0 ? companyCount[0].totalCompanies / limit : 1)
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error });
  }
};




// Delete a company
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    await deleteFromCloudinary(company.companyLogoPublicId);
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting company', error });
  }
};

exports.getSpecificCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company', error });
  }
};