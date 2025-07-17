import { useState } from 'react'
import { Routes, Route, Navigate  } from 'react-router-dom';
import { AuthProvider, useAuth  } from './context/AuthContext';

import Login from './components/auth/Login';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return 
      <div className="flex justify-center items-center h-screen text-xl text-gray-700">
        Loading authentication...
      </div>;
  }
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return 
      <div className="flex justify-center items-center h-screen text-xl text-gray-700">
        Loading...
      </div>;
  }
  return !isAuthenticated ? children : <Navigate to="/dashboard/employees" replace />;
};

function App() {

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
            <Route path="/" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
