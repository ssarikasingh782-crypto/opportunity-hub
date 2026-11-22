const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the company name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a company description'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150',
    },
    location: {
      type: String,
      required: [true, 'Please provide the company location (City, Country)'],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A company must belong to a recruiter'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
companySchema.index({ owner: 1 });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
