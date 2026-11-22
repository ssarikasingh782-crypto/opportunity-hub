import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Users,
  Edit,
  Trash2,
  PlusCircle,
  MapPin,
  Clock,
} from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs/my');
      setJobs(res.data.data.jobs || []);
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to fetch your jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job listing deleted successfully');
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to delete job');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Manage Posted Jobs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View, edit, or check applicants for all your published openings
          </p>
        </div>
        <Link
          to="/post-job"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-md shadow-primary-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" text="Retrieving your postings..." />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs published yet"
          description="Create your first job listing to start receiving student applications."
          actionText="Create a Listing"
          actionLink="/post-job"
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        job.status === 'open'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="capitalize">{job.type}</span>
                    <span>•</span>
                    <span className="capitalize">{job.workMode}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                  <Link
                    to={`/recruiter/jobs/${job._id}/applicants`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 hover:bg-primary-100 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Applicants</span>
                  </Link>

                  <Link
                    to={`/edit-job/${job._id}`}
                    className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Edit Job"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Job"
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

export default ManageJobs;
