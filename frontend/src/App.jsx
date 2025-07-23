import { Routes, Route, Navigate  } from 'react-router-dom';
import { AuthProvider, useAuth  } from './context/AuthContext';

import Layout from './components/common/Layout';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import HomeRedirect from './components/HomeRedirect';
import EmployeeCreate from './components/employee/EmployeeCreate';

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
          {/* Root redirect */}
          <Route path="/" element={<HomeRedirect />} />

          {/* 2. Protected Dashboard Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >

            {/* These are nested under Layout's <Outlet /> */}
            <Route path="employees" element={<EmployeeDashboard />} />
            <Route path="employees/create" element={<EmployeeCreate />} />
          </Route>

          {/* Catch-all for 404 Not Found pages */}
          <Route 
              path="*" 
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Go Home
                    </button>
                  </div>
                </div>
              } 
            />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
