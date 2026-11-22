import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import { Building2, Globe, MapPin, Save } from 'lucide-react';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get('/companies/me');
        if (res.data.data?.company) {
          const c = res.data.data.company;
          setCompany(c);
          setFormData({
            name: c.name,
            description: c.description,
            website: c.website || '',
            location: c.location,
          });
        }
      } catch (err) {
        console.error('Failed to load company profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (company?._id) {
        const res = await api.put(`/companies/${company._id}`, formData);
        setCompany(res.data.data.company);
        toast.success('Company profile updated successfully!');
      } else {
        const res = await api.post('/companies', formData);
        setCompany(res.data.data.company);
        toast.success('Company profile registered successfully!');
      }
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to save company profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Loading company profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Company Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Set up your organization's brand to post jobs and recruit candidates
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            Company Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Apex Technologies Inc."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Headquarters / Location *
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bengaluru, India"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Official Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            Company Description * (min. 10 chars)
          </label>
          <textarea
            rows={5}
            name="description"
            required
            minLength={10}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what your organization builds, mission, and work culture..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-md shadow-primary-500/20 flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : company ? 'Update Company Profile' : 'Register Company'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;
