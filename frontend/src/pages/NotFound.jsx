import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/50 text-amber-600 rounded-3xl flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-3">404</h1>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-8">
        The link you followed may be broken, or the page may have been removed.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-colors text-sm"
      >
        <Home className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};

export default NotFound;
