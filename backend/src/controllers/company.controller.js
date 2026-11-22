const Company = require('../models/Company');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES } = require('../config/constants');

/**
 * @desc    Create or update recruiter company profile
 * @route   POST /api/v1/companies
 * @access  Private (Recruiter)
 */
const createCompany = asyncHandler(async (req, res) => {
  const { name, description, website, logo, location } = req.body;

  // Check if recruiter already owns a company
  const existingOwned = await Company.findOne({ owner: req.user._id });
  if (existingOwned) {
    throw ApiError.conflict('You have already registered a company profile. Use PUT to update it.');
  }

  // Check if company name already exists
  const existingName = await Company.findOne({ name });
  if (existingName) {
    throw ApiError.conflict('A company with this name is already registered.');
  }

  const company = await Company.create({
    name,
    description,
    website: website || '',
    logo: logo || undefined,
    location,
    owner: req.user._id,
  });

  return ApiResponse.created(res, { company }, 'Company profile created successfully');
});

/**
 * @desc    Get company owned by current recruiter
 * @route   GET /api/v1/companies/me
 * @access  Private (Recruiter)
 */
const getMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    return ApiResponse.success(res, { company: null }, 'No company registered yet');
  }
  return ApiResponse.success(res, { company }, 'Company details retrieved successfully');
});

/**
 * @desc    Get company by ID
 * @route   GET /api/v1/companies/:id
 * @access  Public
 */
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate('owner', 'name email');
  if (!company) {
    throw ApiError.notFound('Company not found');
  }
  return ApiResponse.success(res, { company }, 'Company retrieved successfully');
});

/**
 * @desc    Update company profile
 * @route   PUT /api/v1/companies/:id
 * @access  Private (Owner Recruiter or Admin)
 */
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  // Ownership check
  const isOwner = company.owner.toString() === req.user._id.toString();
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw ApiError.forbidden('You are not authorized to update this company');
  }

  const { name, description, website, logo, location } = req.body;

  if (name && name !== company.name) {
    const existingName = await Company.findOne({ name });
    if (existingName) {
      throw ApiError.conflict('A company with this name already exists.');
    }
    company.name = name;
  }

  if (description) company.description = description;
  if (website !== undefined) company.website = website;
  if (logo) company.logo = logo;
  if (location) company.location = location;

  await company.save();

  return ApiResponse.success(res, { company }, 'Company profile updated successfully');
});

module.exports = {
  createCompany,
  getMyCompany,
  getCompanyById,
  updateCompany,
};
