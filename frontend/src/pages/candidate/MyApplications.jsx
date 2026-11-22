import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import {
  FileText,
  MapPin,
  Clock,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications/my');
      setApplications(res.data.data.applications || []);
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await api.delete(`/applications/${applicationId}`);
      toast.success('Application withdrawn successfully');
      setApplications(applications.filter((a) => a._id !== applicationId));
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to withdraw application');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      applied: {
        text: 'Applied',
        style: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300',
      },
      shortlisted: {
        text: 'Shortlisted',
        style: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300',
      },
      hired: {
        text: 'Hired 🎉',
        style: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300',
      },
      rejected: {
        text: 'Not Selected',
        style: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300',
      },
    };
    const c = config[status] || config.applied;
    return (
      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${c.style}`}>
        {c.text}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          My Applications
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Review application statuses and withdraw if needed
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" text="Retrieving applications..." />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications submitted yet"
          description="Explore our curated open positions and start applying today!"
          actionText="Browse Open Jobs"
          actionLink="/jobs"
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {applications.map((app) => (
              <div
                key={app._id}
                className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={app.job?.company?.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100'}
                    alt={app.job?.company?.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-100 dark:border-gray-700 bg-gray-50"
                  />
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {app.job?.title || 'Position'}
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {app.job?.company?.name} • Applied on{' '}
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {app.job?.type}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center">
                        <MapPin className="w-3 h-3 mr-0.5" />
                        {app.job?.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                  {getStatusBadge(app.status)}

                  <button
                    onClick={() => handleWithdraw(app._id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    title="Withdraw Application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
