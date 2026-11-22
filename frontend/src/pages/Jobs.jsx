import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/jobs/JobCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [workMode, setWorkMode] = useState(searchParams.get('workMode') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        sort,
      };
      if (search) params.search = search;
      if (type) params.type = type;
      if (workMode) params.workMode = workMode;
      if (location) params.location = location;
      if (minSalary) params.minSalary = minSalary;

      const res = await api.get('/jobs', { params });
      setJobs(res.data.data || []);
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch candidate's saved job IDs for bookmark indicators
  const fetchSavedJobIds = async () => {
    if (isAuthenticated && user?.role === 'candidate') {
      try {
        const res = await api.get('/saved-jobs');
        const ids = new Set((res.data.data.savedJobs || []).map((s) => s.job?._id));
        setSavedJobIds(ids);
      } catch (err) {
        // silent fallback
      }
    }
  };

  useEffect(() => {
    fetchJobs();
    // Update URL query parameters
    const query = {};
    if (search) query.search = search;
    if (type) query.type = type;
    if (workMode) query.workMode = workMode;
    if (location) query.location = location;
    if (minSalary) query.minSalary = minSalary;
    if (sort !== '-createdAt') query.sort = sort;
    if (page > 1) query.page = page;
    setSearchParams(query, { replace: true });
  }, [page, type, workMode, sort]);

  useEffect(() => {
    fetchSavedJobIds();
  }, [isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleResetFilters = () => {
    setSearch('');
    setType('');
    setWorkMode('');
    setLocation('');
    setMinSalary('');
    setSort('-createdAt');
    setPage(1);
    setSearchParams({});
    setTimeout(fetchJobs, 10);
  };

  const handleToggleSave = async (jobId) => {
    if (!isAuthenticated) {
      return toast.error('Please login to save opportunities');
    }
    if (user?.role !== 'candidate') {
      return toast.error('Only candidates can save jobs');
    }

    try {
      if (savedJobIds.has(jobId)) {
        await api.delete(`/jobs/${jobId}/save`);
        const updated = new Set(savedJobIds);
        updated.delete(jobId);
        setSavedJobIds(updated);
        toast.success('Removed from saved jobs');
      } else {
        await api.post(`/jobs/${jobId}/save`);
        const updated = new Set(savedJobIds);
        updated.add(jobId);
        setSavedJobIds(updated);
        toast.success('Job saved to your favorites');
      }
    } catch (err) {
      toast.error(err.formattedMessage || 'Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Banner */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          Explore Jobs & Internships
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Find your next career step from high-impact startups to industry leaders
        </p>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, skills (e.g. React, Node.js), or keywords..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          <div className="sm:w-60">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location or 'Remote'"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-md shadow-primary-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Main Content: Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 dark:text-white">
                <SlidersHorizontal className="w-4 h-4 text-primary-600" />
                <span>Filters</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3 mr-0.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Opportunity Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Opportunity Type
              </label>
              <div className="space-y-2">
                {[
                  { label: 'All Types', value: '' },
                  { label: 'Full-Time Job', value: 'job' },
                  { label: 'Internship', value: 'internship' },
                ].map((item) => (
                  <label key={item.value} className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="jobType"
                      checked={type === item.value}
                      onChange={() => {
                        setType(item.value);
                        setPage(1);
                      }}
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <span className="ml-2.5">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Work Mode
              </label>
              <div className="space-y-2">
                {[
                  { label: 'Any Mode', value: '' },
                  { label: 'Remote', value: 'remote' },
                  { label: 'Hybrid', value: 'hybrid' },
                  { label: 'Onsite', value: 'onsite' },
                ].map((item) => (
                  <label key={item.value} className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="workMode"
                      checked={workMode === item.value}
                      onChange={() => {
                        setWorkMode(item.value);
                        setPage(1);
                      }}
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <span className="ml-2.5">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Annual Salary */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Min. Salary (INR)
              </label>
              <select
                value={minSalary}
                onChange={(e) => {
                  setMinSalary(e.target.value);
                  setPage(1);
                  setTimeout(fetchJobs, 10);
                }}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 outline-none"
              >
                <option value="">Any Salary</option>
                <option value="300000">₹3,00,000+ (3 LPA)</option>
                <option value="600000">₹6,00,000+ (6 LPA)</option>
                <option value="1000000">₹10,00,000+ (10 LPA)</option>
                <option value="1500000">₹15,00,000+ (15 LPA)</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Listings Content */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{jobs.length}</span> of{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> positions
            </p>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 font-medium">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="text-xs font-semibold p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none"
              >
                <option value="-createdAt">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="salary-desc">Highest Salary</option>
                <option value="salary-asc">Lowest Salary</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader size="lg" text="Finding opportunities..." />
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No open opportunities match your search"
              description="Try adjusting your keyword, resetting filters, or selecting a broader location."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  isSaved={savedJobIds.has(job._id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-sm font-semibold px-4 text-gray-700 dark:text-gray-300">
                Page {page} of {pagination.pages}
              </span>

              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage(page + 1)}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Jobs;
