import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import Login from './auth/Login';

const HomeRedirect = () => {

  const { isAuthenticated, user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-700">
        Loading application...
      </div>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Redirect based on user role
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.role === 'EMPLOYEE') {
    return <Navigate to="/employee/dashboard" replace />;
  }

  // For users with unknown roles
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Error</h1>
        <p className="text-gray-600 mb-4">Unable to determine user role</p>
        <button 
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Logout and Try Again
        </button>
      </div>
    </div>
  );

}

export default HomeRedirect