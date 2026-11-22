const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('../config/constants');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Application must be linked to a job'],
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Application must be submitted by a candidate'],
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: [
          APPLICATION_STATUS.APPLIED,
          APPLICATION_STATUS.SHORTLISTED,
          APPLICATION_STATUS.REJECTED,
          APPLICATION_STATUS.HIRED,
        ],
        message: 'Invalid application status',
      },
      default: APPLICATION_STATUS.APPLIED,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound UNIQUE index to prevent candidate from applying twice to the same job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ candidate: 1, appliedAt: -1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
