import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import StudentProfileSetup from './pages/StudentProfileSetup';
import AlumniProfileSetup from './pages/AlumniProfileSetup';
import StudentDashboard from './pages/StudentDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import Mentorship from './pages/Mentorship';
import Community from './pages/Community';

import './App.css';

/**
 * ✅ ProtectedRoute
 * - Prevents logout on navigation
 * - Uses user from AuthContext ONLY
 * - Handles loading state correctly
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // While restoring auth from localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not logged in → go to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Role mismatch → go to landing
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />

      {/* Student Routes */}
      <Route
        path="/student/profile-setup"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentProfileSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Alumni Routes */}
      <Route
        path="/alumni/profile-setup"
        element={
          <ProtectedRoute allowedRoles={['alumni']}>
            <AlumniProfileSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alumni/dashboard"
        element={
          <ProtectedRoute allowedRoles={['alumni']}>
            <AlumniDashboard />
          </ProtectedRoute>
        }
      />

      {/* Shared Routes */}
      <Route
        path="/mentorship"
        element={
          <ProtectedRoute allowedRoles={['student', 'alumni']}>
            <Mentorship />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute allowedRoles={['student', 'alumni']}>
            <Community />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
