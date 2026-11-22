import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Sparkles, Building2, TrendingUp, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('search', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-primary-50/50 via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-100/70 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            <span>Discover 500+ Verified Tech Jobs & Internships</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Launch Your Career With Top Companies &{' '}
            <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Exciting Startups
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Apply to curated developer, design, and analyst positions with transparent salary bands and real-time application tracking.
          </p>

          {/* Interactive Hero Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-10 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-2.5 sm:p-3 rounded-2xl sm:rounded-full shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-2 sm:gap-0"
          >
            <div className="flex items-center flex-1 w-full px-3 py-1">
              <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, keywords, or skills (e.g. React, Node.js)"
                className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none"
              />
            </div>

            <div className="hidden sm:block h-8 w-px bg-gray-200 dark:bg-gray-700"></div>

            <div className="flex items-center flex-1 w-full px-3 py-1">
              <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country, or 'Remote'"
                className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-md shadow-primary-500/20 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Search Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Trending:</span>
            {['React', 'Node.js', 'Frontend', 'Remote', 'Internship', 'Python'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/jobs?search=${tag}`)}
                className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mb-5">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Verified Openings
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Every job listing has verified company details, salary/stipend ranges, and direct recruiter links.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Real-time Status Tracking
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Track your application through Applied, Shortlisted, Interviewed, and Hired stages with full transparency.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Recruiter Candidate Hub
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Employers manage openings, filter resumes, and communicate status directly from a dedicated dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* College Project Credit Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-primary-600 to-indigo-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Ready to apply or hire talent?</h3>
            <p className="text-primary-100 text-sm max-w-xl">
              Create your account in under 60 seconds and start exploring positions or publishing listings.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/jobs"
              className="px-5 py-2.5 rounded-xl bg-white text-primary-700 font-semibold text-sm hover:bg-primary-50 transition-colors shadow-sm"
            >
              Browse Jobs
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-primary-800 text-white font-semibold text-sm hover:bg-primary-900 transition-colors"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
