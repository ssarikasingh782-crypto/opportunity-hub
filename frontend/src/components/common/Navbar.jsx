import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  User,
  LogOut,
  Bookmark,
  PlusCircle,
  FileText,
  LayoutDashboard,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-primary-600 dark:from-white dark:via-primary-300 dark:to-primary-400 bg-clip-text text-transparent">
              OpportunityHub
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/jobs"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Explore Jobs
            </Link>
            <Link
              to="/jobs?type=internship"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Internships
            </Link>

            {/* Role specific quick buttons */}
            {isAuthenticated && role === 'recruiter' && (
              <Link
                to="/post-job"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 hover:bg-primary-100 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Job</span>
              </Link>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 rounded-full hover:ring-2 hover:ring-primary-500/20 transition-all"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {user?.role}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Role aware navigation items */}
                    <Link
                      to={
                        role === 'admin'
                          ? '/admin/dashboard'
                          : role === 'recruiter'
                          ? '/recruiter/dashboard'
                          : '/candidate/dashboard'
                      }
                      className="flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary-500" />
                      <span>Dashboard</span>
                    </Link>

                    {role === 'candidate' && (
                      <>
                        <Link
                          to="/my-applications"
                          className="flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <FileText className="w-4 h-4 text-emerald-500" />
                          <span>My Applications</span>
                        </Link>
                        <Link
                          to="/saved-jobs"
                          className="flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Bookmark className="w-4 h-4 text-amber-500" />
                          <span>Saved Jobs</span>
                        </Link>
                      </>
                    )}

                    {role === 'recruiter' && (
                      <>
                        <Link
                          to="/recruiter/my-jobs"
                          className="flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Briefcase className="w-4 h-4 text-indigo-500" />
                          <span>Manage Jobs</span>
                        </Link>
                        <Link
                          to="/recruiter/company"
                          className="flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <ShieldCheck className="w-4 h-4 text-sky-500" />
                          <span>Company Profile</span>
                        </Link>
                      </>
                    )}

                    <Link
                      to="/profile"
                      className="flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span>Edit Profile</span>
                    </Link>

                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm shadow-primary-500/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/jobs"
            className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Explore Jobs
          </Link>
          <Link
            to="/jobs?type=internship"
            className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Internships
          </Link>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
              <Link
                to={
                  role === 'admin'
                    ? '/admin/dashboard'
                    : role === 'recruiter'
                    ? '/recruiter/dashboard'
                    : '/candidate/dashboard'
                }
                className="block px-3 py-2 text-base font-medium text-primary-600 dark:text-primary-400"
              >
                Dashboard ({user?.name})
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300"
              >
                Profile & Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col space-y-2">
              <Link
                to="/login"
                className="block text-center py-2 text-base font-medium text-gray-700 dark:text-gray-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="block text-center py-2 text-base font-medium text-white bg-primary-600 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
