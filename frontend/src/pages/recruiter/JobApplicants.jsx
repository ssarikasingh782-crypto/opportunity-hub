import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import {
  FileText,
  Mail,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

const JobApplicants = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/${id}/applications`);
      setApplications(res.data.data.applications || []);
      if (res.data.data.applications?.[0]?.job?.title) {
        setJobTitle(res.data.data.applications[0].job.title);
      }
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      toast.success(`Applicant status updated to '${newStatus}'`);
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/recruiter/my-jobs"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Jobs</span>
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Applicants Review
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total {applications.length} candidate(s) applied for this position
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" text="Retrieving candidate submissions..." />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No candidates have applied yet"
          description="As soon as students apply to this position, their resumes and profiles will appear here."
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {applications.map((app) => (
              <div key={app._id} className="p-6 space-y-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Candidate Info */}
                  <div className="flex items-start space-x-4">
                    <img
                      src={app.candidate?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                      alt={app.candidate?.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {app.candidate?.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
                        <Mail className="w-3.5 h-3.5 mr-1" />
                        {app.candidate?.email}
                      </p>
                      {app.candidate?.education && (
                        <p className="text-xs text-gray-400 mt-1">
                          🎓 {app.candidate.education}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Status:
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="applied">Applied</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Candidate Skills */}
                {app.candidate?.skills && app.candidate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {app.candidate.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Cover Letter Note */}
                {app.coverLetter && (
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Note: </span>
                    {app.coverLetter}
                  </div>
                )}

                {/* Resume Link */}
                <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                  <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                  {app.resumeUrl ? (
                    <a
                      href={app.resumeUrl.startsWith('http') ? app.resumeUrl : `http://localhost:5000${app.resumeUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 font-bold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Resume / CV</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-gray-400">No resume link provided</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
