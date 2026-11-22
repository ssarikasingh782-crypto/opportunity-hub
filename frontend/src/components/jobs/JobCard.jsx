import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Bookmark,
  Building2,
  ArrowRight,
} from 'lucide-react';

const JobCard = ({ job, isSaved = false, onToggleSave }) => {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive';
    if (min && max) {
      return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L`;
    }
    return `₹${((min || max) / 100000).toFixed(1)}L/yr`;
  };

  const getWorkModeBadge = (mode) => {
    const styles = {
      remote: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
      hybrid: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300',
      onsite: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    };
    return styles[mode] || styles.onsite;
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Company + Save Button */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3.5">
            <img
              src={job.company?.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100'}
              alt={job.company?.name || 'Company'}
              className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-gray-700 bg-gray-50 flex-shrink-0"
            />
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {job.company?.name || 'Verified Employer'}
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                <Link to={`/jobs/${job._id}`}>{job.title}</Link>
              </h3>
            </div>
          </div>

          {onToggleSave && (
            <button
              onClick={() => onToggleSave(job._id)}
              className={`p-2 rounded-xl transition-colors ${
                isSaved
                  ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Badges & Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
            {job.type}
          </span>
          <span
            className={`text-[11px] font-semibold capitalize px-2.5 py-1 rounded-md ${getWorkModeBadge(
              job.workMode
            )}`}
          >
            {job.workMode}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {job.location}
          </span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            <DollarSign className="w-3.5 h-3.5 mr-0.5 text-emerald-600" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
        </div>

        {/* Snippet */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* Skills Chips */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-xs px-2 py-0.5 text-gray-400">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center space-x-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
