import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/jobs/ApplyModal';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Calendar,
  Users,
  ExternalLink,
  Bookmark,
  Send,
  Building2,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data.data.job);
    } catch (err) {
      toast.error(err.formattedMessage || 'Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const checkUserStatus = async () => {
    if (isAuthenticated && user?.role === 'candidate') {
      try {
        // Check saved status
        const savedRes = await api.get('/saved-jobs');
        const saved = (savedRes.data.data.savedJobs || []).some(
          (s) => s.job?._id === id
        );
        setIsSaved(saved);

        // Check if candidate already applied
        const appRes = await api.get('/applications/my');
        const applied = (appRes.data.data.applications || []).some(
          (a) => a.job?._id === id
        );
        setHasApplied(applied);
      } catch (err) {
        // silent check
      }
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    checkUserStatus();
  }, [id, isAuthenticated]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) return toast.error('Please login to save opportunities');
    if (user?.role !== 'candidate') return toast.error('Only candidates can save jobs');

    try {
      if (isSaved) {
        await api.delete(`/jobs/${id}/save`);
        setIsSaved(false);
        toast.success('Removed from saved jobs');
      } else {
        await api.post(`/jobs/${id}/save`);
        setIsSaved(true);
        toast.success('Saved to your favorites');
      }
    } catch (err) {
      toast.error(err.formattedMessage || 'Action failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Loading job information..." />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/jobs"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </Link>

      {/* Main Job Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start space-x-4">
            <img
              src={job.company?.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120'}
              alt={job.company?.name}
              className="w-16 h-16 rounded-2xl object-cover border border-gray-100 dark:border-gray-700 bg-gray-50"
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                {job.company?.name}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {job.location}
                </span>
                <span className="flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-1" />
                  <span className="capitalize">{job.workMode}</span>
                </span>
                <span className="flex items-center font-semibold text-gray-700 dark:text-gray-200">
                  <DollarSign className="w-3.5 h-3.5 mr-0.5 text-emerald-600" />
                  {job.salaryMin && job.salaryMax
                    ? `₹${(job.salaryMin / 100000).toFixed(1)}L - ₹${(job.salaryMax / 100000).toFixed(1)}L`
                    : 'Competitive'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleToggleSave}
              className={`p-3 rounded-2xl border transition-colors ${
                isSaved
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50'
              }`}
              title={isSaved ? 'Saved' : 'Save'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {hasApplied ? (
              <div className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Application Submitted</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    setModalOpen(true);
                  }
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-md shadow-primary-500/25 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100 dark:border-gray-700/60">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900">
            <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Type</span>
            <p className="text-sm font-bold text-gray-900 dark:text-white capitalize mt-0.5">{job.type}</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900">
            <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Experience</span>
            <p className="text-sm font-bold text-gray-900 dark:text-white capitalize mt-0.5">{job.experienceLevel || 'Entry Level'}</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900">
            <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Openings</span>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{job.openings || 1} Position(s)</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900">
            <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Posted Date</span>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Description & Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Role Description & Scope
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                  Required Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Company Overview Card */}
        <aside className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-primary-600" />
              <span>About the Company</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {job.company?.description || 'Company details are verified.'}
            </p>
            {job.company?.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline pt-2"
              >
                <span>Visit Company Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onApplySuccess={() => setHasApplied(true)}
      />
    </div>
  );
};

export default JobDetails;
