import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import { Briefcase, ArrowLeft, Save } from 'lucide-react';

const PostEditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'job',
    workMode: 'onsite',
    location: '',
    salaryMin: '',
    salaryMax: '',
    skills: '',
    experienceLevel: 'entry',
    openings: 1,
    deadline: '',
    status: 'open',
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchJob = async () => {
        try {
          const res = await api.get(`/jobs/${id}`);
          const job = res.data.data.job;
          setFormData({
            title: job.title,
            description: job.description,
            type: job.type,
            workMode: job.workMode,
            location: job.location,
            salaryMin: job.salaryMin || '',
            salaryMax: job.salaryMax || '',
            skills: job.skills ? job.skills.join(', ') : '',
            experienceLevel: job.experienceLevel || 'entry',
            openings: job.openings || 1,
            deadline: job.deadline ? job.deadline.split('T')[0] : '',
            status: job.status || 'open',
          });
        } catch (err) {
          toast.error(err.formattedMessage || 'Failed to fetch job details');
          navigate('/recruiter/my-jobs');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        salaryMin: Number(formData.salaryMin) || 0,
        salaryMax: Number(formData.salaryMax) || 0,
        openings: Number(formData.openings) || 1,
      };

      if (isEditing) {
        await api.put(`/jobs/${id}`, payload);
        toast.success('Job listing updated successfully!');
      } else {
        await api.post('/jobs', payload);
        toast.success('New job posted successfully!');
      }

      navigate('/recruiter/my-jobs');
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to save job listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Loading job editor..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Job Listing' : 'Post a New Opportunity'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Provide detailed specifications to connect with qualified student candidates
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            Position Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Frontend React Developer, Data Analyst Intern"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Opportunity Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="job">Full-Time Job</option>
              <option value="internship">Student Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Work Mode *
            </label>
            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="onsite">Onsite</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Location *
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bengaluru, Remote, Mumbai"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Min Salary / Stipend (INR)
            </label>
            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              placeholder="e.g. 500000"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Max Salary / Stipend (INR)
            </label>
            <input
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              placeholder="e.g. 1000000"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="entry">Entry Level / Fresher</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="lead">Lead / Architect</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Number of Openings
            </label>
            <input
              type="number"
              min="1"
              name="openings"
              value={formData.openings}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {isEditing && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Listing Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="open">Open (Accepting Applications)</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            Key Skills Required (Comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            Job Description & Responsibilities * (min. 20 chars)
          </label>
          <textarea
            rows={8}
            name="description"
            required
            minLength={20}
            value={formData.description}
            onChange={handleChange}
            placeholder="Outline daily duties, tech stack, candidate qualifications, and benefits..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-xs sm:text-sm"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/recruiter/my-jobs')}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-500/20 flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : isEditing ? 'Update Listing' : 'Publish Listing'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditJob;
