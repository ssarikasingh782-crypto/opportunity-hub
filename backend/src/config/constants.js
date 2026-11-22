/**
 * Application Constants & Enums
 * Central source of truth for user roles, statuses, and options
 */
const ROLES = {
  CANDIDATE: 'candidate',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
};

const JOB_TYPES = {
  JOB: 'job',
  INTERNSHIP: 'internship',
};

const WORK_MODES = {
  ONSITE: 'onsite',
  REMOTE: 'remote',
  HYBRID: 'hybrid',
};

const JOB_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  PENDING: 'pending',
  REMOVED: 'removed',
};

const APPLICATION_STATUS = {
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  HIRED: 'hired',
};

const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
};

module.exports = {
  ROLES,
  JOB_TYPES,
  WORK_MODES,
  JOB_STATUS,
  APPLICATION_STATUS,
  EXPERIENCE_LEVELS,
};
