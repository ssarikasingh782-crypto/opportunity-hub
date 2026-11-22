import React, { useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { X, Send, FileText, CheckCircle2 } from 'lucide-react';

const ApplyModal = ({ job, isOpen, onClose, onApplySuccess }) => {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [customResumeUrl, setCustomResumeUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post(`/jobs/${job._id}/apply`, {
        coverLetter,
        resumeUrl: customResumeUrl || user?.resume || '',
      });

      toast.success(res.data.message || 'Application submitted successfully!');
      onApplySuccess();
      onClose();
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-700 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          Apply for Position
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {job.title} at <span className="font-semibold text-gray-700 dark:text-gray-300">{job.company?.name}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Resume Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Attached Resume
            </label>
            {user?.resume ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Profile Resume Attached
                  </span>
                </div>
                <span className="text-xs text-emerald-600 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready
                </span>
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  placeholder="Paste link to your resume (Google Drive, Dropbox, PDF URL)"
                  value={customResumeUrl}
                  onChange={(e) => setCustomResumeUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  You can also upload a PDF permanently on your Profile page.
                </p>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Cover Letter / Note to Recruiter
            </label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you are an ideal fit for this role, relevant projects, and your availability..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-500/20 flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
