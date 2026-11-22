import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (loggedInUser.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate(from === '/' ? '/candidate/dashboard' : from, { replace: true });
      }
    } catch (err) {
      // handled by AuthContext toast
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Fill Demo Credentials for viva examiners
  const fillCredentials = (role) => {
    if (role === 'candidate') {
      setEmail('candidate@example.com');
      setPassword('Password123!');
    } else if (role === 'recruiter') {
      setEmail('recruiter@example.com');
      setPassword('Password123!');
    } else if (role === 'admin') {
      setEmail('admin@example.com');
      setPassword('AdminPassword123!');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to access your dashboard and opportunities
          </p>
        </div>

        {/* 1-Click Examiner Demo Fillers */}
        <div className="mb-6 p-3 bg-primary-50 dark:bg-primary-950/40 rounded-xl border border-primary-100 dark:border-primary-900/40">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-primary-700 dark:text-primary-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Viva Demo 1-Click Credentials:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('candidate')}
              className="px-2 py-1 bg-white dark:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 shadow-xs"
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('recruiter')}
              className="px-2 py-1 bg-white dark:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 shadow-xs"
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="px-2 py-1 bg-white dark:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 shadow-xs"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
