const mongoose = require('mongoose');
const {
  JOB_TYPES,
  WORK_MODES,
  JOB_STATUS,
  EXPERIENCE_LEVELS,
} = require('../config/constants');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed job description'],
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Job must be linked to a company'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Job must have a recruiter who posted it'],
    },
    type: {
      type: String,
      enum: {
        values: [JOB_TYPES.JOB, JOB_TYPES.INTERNSHIP],
        message: 'Job type must be either job or internship',
      },
      default: JOB_TYPES.JOB,
      required: true,
    },
    workMode: {
      type: String,
      enum: {
        values: [WORK_MODES.ONSITE, WORK_MODES.REMOTE, WORK_MODES.HYBRID],
        message: 'Work mode must be onsite, remote, or hybrid',
      },
      default: WORK_MODES.ONSITE,
      required: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a job location'],
      trim: true,
    },
    salaryMin: {
      type: Number,
      default: 0,
      min: [0, 'Minimum salary/stipend cannot be negative'],
    },
    salaryMax: {
      type: Number,
      default: 0,
      min: [0, 'Maximum salary/stipend cannot be negative'],
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      enum: {
        values: [
          EXPERIENCE_LEVELS.ENTRY,
          EXPERIENCE_LEVELS.MID,
          EXPERIENCE_LEVELS.SENIOR,
          EXPERIENCE_LEVELS.LEAD,
        ],
        message: 'Invalid experience level',
      },
      default: EXPERIENCE_LEVELS.ENTRY,
    },
    deadline: {
      type: Date,
    },
    openings: {
      type: Number,
      default: 1,
      min: [1, 'Number of openings must be at least 1'],
    },
    status: {
      type: String,
      enum: {
        values: [
          JOB_STATUS.OPEN,
          JOB_STATUS.CLOSED,
          JOB_STATUS.PENDING,
          JOB_STATUS.REMOVED,
        ],
        message: 'Invalid job status',
      },
      default: JOB_STATUS.OPEN,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index on status and type for high-frequency filtered queries
jobSchema.index({ status: 1, type: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ createdAt: -1 });

// Full-text search index on title, description, and skills
jobSchema.index(
  {
    title: 'text',
    description: 'text',
    skills: 'text',
  },
  {
    weights: {
      title: 5,
      skills: 3,
      description: 1,
    },
    name: 'JobTextIndex',
  }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
