import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      toast.success(res.data.message || 'Reset instructions sent!');
      setSubmitted(true);
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 sm:p-10">
        <Link
          to="/login"
          className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Back to login</span>
        </Link>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Instructions Dispatched
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              If an account with that email exists, we have sent a secure 10-minute password reset link.
            </p>
            <Link
              to="/login"
              className="inline-block py-2.5 px-6 rounded-xl text-sm font-semibold bg-primary-600 text-white"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Enter the email address registered with your account to receive a reset token.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl text-white font-semibold bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/25 transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
