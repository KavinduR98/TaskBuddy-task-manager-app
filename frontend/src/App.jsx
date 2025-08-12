import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Layout from './components/common/Layout';
import HomeRedirect from './components/HomeRedirect';
import TaskDashboard from './components/admin/task/TaskDashboard';
import TaskCreate from './components/admin/task/TaskCreate';
import TaskUpdate from './components/admin/task/TaskUpdate';
import AdminDashboard from './components/admin/dashboard/AdminDashboard'
import TeamMembers from './components/admin/members/TeamMembers';
import MemberDashboard from './components/team-member/MemberDashboard';
import MyTasks from './components/team-member/MyTasks';
import ViewMemberTask from './components/team-member/ViewMemberTask';
import Register from './components/auth/Register';

// Protected Route for authenticated ADMIN users only
const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-xl text-gray-700">
                Loading authentication...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (user?.role !== 'ADMIN') {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-4">Admin access required</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

// Protected Route for authenticated EMPLOYEE users only
const EmployeeProtectedRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-xl text-gray-700">
                Loading authentication...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (user?.role !== 'MEMBER') {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-4">Member access required</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

function App() {

    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50">
                {/* Toast Container */}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 2000,
                            theme: {
                                primary: '#4aed88',
                            },
                        },
                        error: {
                            duration: 4000,
                            theme: {
                                primary: '#ff4b4b',
                            },
                        },
                    }}
                />
                <Routes>
                    {/* Home redirect based on authentication and role */}
                    <Route path="/" element={<HomeRedirect />} />

                    <Route path="/register" element={<Register />} />

                    {/* Admin Routes */}
                    <Route
                        path="/admin/*"
                        element={
                            <AdminProtectedRoute>
                                <Layout />
                            </AdminProtectedRoute>
                        }
                    >
                        {/* Admin Dashboard */}
                        <Route path="dashboard" element={<AdminDashboard />} />

                        {/* Task Management Routes */}
                        <Route path="tasks" element={<TaskDashboard />} />
                        <Route path="tasks/create" element={<TaskCreate />} />
                        <Route path="tasks/edit/:id" element={<TaskUpdate />} />

                        {/* Team Members */}
                        <Route path="team-members" element={<TeamMembers />} />
                    </Route>

                    {/* Members Routes */}
                    <Route
                        path="/member/*"
                        element={
                            <EmployeeProtectedRoute>
                                <Layout />
                            </EmployeeProtectedRoute>
                        }
                    >
                        <Route path='dashboard' element={<MemberDashboard />} />
                        <Route path='my-tasks' element={<MyTasks />} />
                        <Route path='tasks/edit/:id' element={<ViewMemberTask />} />
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
