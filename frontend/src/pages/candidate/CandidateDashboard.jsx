import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import {
  FileText,
  Bookmark,
  CheckCircle2,
  Clock,
  XCircle,
  Briefcase,
  ArrowRight,
} from 'lucide-react';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load candidate stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Loading dashboard..." />
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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-primary-200">
            Candidate Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Hello, {user?.name}! 👋
          </h1>
          <p className="text-sm text-primary-100 mt-1">
            Track your job applications, interviews, and saved opportunities here.
          </p>
        </div>
        <Link
          to="/jobs"
          className="px-6 py-2.5 rounded-xl bg-white text-primary-700 font-semibold text-sm hover:bg-primary-50 transition-colors shadow-sm"
        >
          Explore More Jobs
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Applied</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            {stats?.totalApplications || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Shortlisted</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            {statusMap.shortlisted}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Offers / Hired</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            {statusMap.hired}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center mb-3">
            <Bookmark className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Saved Jobs</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            {stats?.totalSavedJobs || 0}
          </p>
        </div>
      </div>

      {/* Recent Applications Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Applications
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Live status progression of your job submissions
            </p>
          </div>
          <Link
            to="/my-applications"
            className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center"
          >
            <span>View All Applications</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {(!stats?.recentApplications || stats.recentApplications.length === 0) ? (
          <div className="py-12 text-center text-sm text-gray-400">
            You haven't applied to any positions yet.{' '}
            <Link to="/jobs" className="text-primary-600 font-semibold hover:underline">
              Browse Openings
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {stats.recentApplications.map((app) => (
              <div key={app._id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={app.job?.company?.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100'}
                    alt={app.job?.company?.name}
                    className="w-10 h-10 rounded-xl object-cover border border-gray-100 dark:border-gray-700 bg-gray-50"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {app.job?.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {app.job?.company?.name} • Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    app.status === 'hired'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : app.status === 'shortlisted'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : app.status === 'rejected'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
