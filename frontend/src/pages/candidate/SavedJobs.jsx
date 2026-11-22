import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import JobCard from '../../components/jobs/JobCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/saved-jobs');
      setSavedJobs(res.data.data.savedJobs || []);
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}/save`);
      setSavedJobs(savedJobs.filter((s) => s.job?._id !== jobId));
      toast.success('Job removed from favorites');
    } catch (err) {
      toast.error(err.formattedMessage || 'Failed to remove job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Saved Jobs & Internships
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Opportunities you bookmarked for later application
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" text="Loading saved positions..." />
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          title="No saved jobs yet"
          description="Bookmark jobs and internships while browsing to keep them organized here."
          actionText="Browse All Jobs"
          actionLink="/jobs"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((saved) => (
            <JobCard
              key={saved._id}
              job={saved.job}
              isSaved={true}
              onToggleSave={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
