import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  Building2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch recruiter stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Loading recruiter dashboard..." />
      </div>
    );
  }

  const statusMap = stats?.byStatus || {
    applied: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-primary-700 to-purple-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-primary-200">
            Employer Management Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Welcome, {user?.name}! 💼
          </h1>
          <p className="text-sm text-primary-100 mt-1">
            Manage your company job listings, review student talent, and update hiring statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/recruiter/company"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs transition-colors flex items-center space-x-1.5"
          >
            <Building2 className="w-4 h-4" />
            <span>Company Profile</span>
          </Link>
          <Link
            to="/post-job"
            className="px-5 py-2.5 rounded-xl bg-white text-primary-700 font-semibold text-sm hover:bg-primary-50 transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mb-3">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Jobs Posted</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            {stats?.totalJobs || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Active Listings</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            {stats?.activeJobs || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Applicants</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            {stats?.totalApplicants || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Shortlisted / Hired</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            {(statusMap.shortlisted || 0) + (statusMap.hired || 0)}
          </p>
        </div>
      </div>

      {/* Recent Applicants Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Candidates Applied
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Students and graduates who applied to your recent postings
            </p>
          </div>
          <Link
            to="/recruiter/my-jobs"
            className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center"
          >
            <span>Manage All Openings</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {(!stats?.recentApplicants || stats.recentApplicants.length === 0) ? (
          <div className="py-12 text-center text-sm text-gray-400">
            No candidates have applied to your active listings yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {stats.recentApplicants.map((app) => (
              <div key={app._id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={app.candidate?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={app.candidate?.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {app.candidate?.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Applied for <span className="font-semibold">{app.job?.title}</span> • {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/recruiter/jobs/${app.job?._id}/applicants`}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 transition-colors"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
