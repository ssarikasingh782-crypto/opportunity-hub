import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Public & Auth Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Job Pages
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import MyApplications from './pages/candidate/MyApplications';
import SavedJobs from './pages/candidate/SavedJobs';
import Profile from './pages/Profile';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostEditJob from './pages/recruiter/PostEditJob';
import ManageJobs from './pages/recruiter/ManageJobs';
import JobApplicants from './pages/recruiter/JobApplicants';
import CompanyProfile from './pages/recruiter/CompanyProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminJobs from './pages/admin/AdminJobs';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />

            {/* Public Job Listings & Details */}
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetails />} />

            {/* Candidate Protected Routes */}
            <Route
              path="candidate/dashboard"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-applications"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="saved-jobs"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <SavedJobs />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Protected Routes */}
            <Route
              path="recruiter/dashboard"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="post-job"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <PostEditJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit-job/:id"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <PostEditJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/my-jobs"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <ManageJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/jobs/:id/applicants"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <JobApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/company"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/jobs"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminJobs />
                </ProtectedRoute>
              }
            />

            {/* Common Authenticated Routes */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 404 Not Found Route */}
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
