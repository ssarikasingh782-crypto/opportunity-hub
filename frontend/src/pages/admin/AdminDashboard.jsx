import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import {
  Users,
  Briefcase,
  FileText,
  Building2,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load admin metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Loading platform analytics..." />
      </div>
    );
  }

  // Monthly trends for Bar Chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const jobTrendLabels = (stats?.monthlyTrends?.jobs || []).map(
    (item) => `${months[item._id.month - 1]} ${item._id.year}`
  );
  const jobTrendData = (stats?.monthlyTrends?.jobs || []).map((item) => item.count);

  const barChartData = {
    labels: jobTrendLabels.length > 0 ? jobTrendLabels : ['Recent Period'],
    datasets: [
      {
        label: 'Jobs Published',
        data: jobTrendData.length > 0 ? jobTrendData : [stats?.jobs?.total || 1],
        backgroundColor: '#6366f1',
        borderRadius: 8,
      },
    ],
  };

  // User Distribution for Doughnut Chart
  const doughnutData = {
    labels: ['Candidates', 'Recruiters'],
    datasets: [
      {
        data: [stats?.users?.candidates || 1, stats?.users?.recruiters || 1],
        backgroundColor: ['#3b82f6', '#8b5cf6'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Control Center</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Platform Analytics & Governance
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            System overview, user management, and aggregate listings monitoring
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/users"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs transition-colors"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/jobs"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Job Moderation
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Registered Users</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            {stats?.users?.total || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Companies Registered</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            {stats?.companies || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mb-3">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Openings</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            {stats?.jobs?.total || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Applications Processed</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
            {stats?.applications?.total || 0}
          </p>
        </div>
      </div>

      {/* Chart.js Aggregations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Activity Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
            Monthly Jobs Creation (Past 6 Months)
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Aggregated via MongoDB pipeline ($group by $year and $month)
          </p>
          <div className="h-64 flex items-center justify-center">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        {/* User Distribution Doughnut Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              User Demographics
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Platform ratio of Candidates vs Recruiters
            </p>
          </div>
          <div className="h-56 flex items-center justify-center">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
