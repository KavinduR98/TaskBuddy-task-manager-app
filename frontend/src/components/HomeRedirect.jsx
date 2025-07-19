import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import Login from './auth/Login';

const HomeRedirect = () => {

    const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-700">
        Loading application...
      </div>
    );
  }

  // Redirect based on authentication status
  return isAuthenticated ? (
    <Navigate to="/dashboard/employees" replace />
  ) : (
    // If NOT authenticated, render the Login component directly at the root path
    <Login />
  );

}

export default HomeRedirect