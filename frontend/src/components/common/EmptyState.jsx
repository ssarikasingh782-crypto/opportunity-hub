import React from 'react';
import { FolderSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = FolderSearch,
  title = 'No records found',
  description = 'There is currently no data matching your criteria.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm my-6">
      <div className="w-14 h-14 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
        {description}
      </p>
      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
          >
            {actionText}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
