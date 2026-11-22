import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Search,
} from 'lucide-react';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs', {
        params: { search: search.trim() || undefined, limit: 50 },
      });
      setJobs(res.data.data || []);
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const handleRemoveJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to remove this job listing as an admin?')) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job removed from the portal');
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to remove job');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Job Moderation
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Review and moderate active job and internship postings across all companies
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchAllJobs()}
            placeholder="Search listings by title, company, or skills..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          onClick={fetchAllJobs}
          className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" text="Loading job listings..." />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState title="No jobs found" description="No jobs match your search criteria." />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20"
              >
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    <Link to={`/jobs/${job._id}`} className="hover:text-primary-600">
                      {job.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {job.company?.name} • Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {job.type}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">{job.workMode}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Link
                    to={`/jobs/${job._id}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-xl hover:bg-gray-100"
                    title="Preview Public Listing"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleRemoveJob(job._id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Moderate / Remove</span>
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

export default AdminJobs;
