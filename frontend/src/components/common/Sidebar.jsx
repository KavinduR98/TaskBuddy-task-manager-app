import { CheckSquare, Home, Users, Plus, LogOut, BarChart3, ListTodo  } from 'lucide-react';
import React from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Determine if user is admin or employee based on current path
    const isAdminPanel = location.pathname.startsWith('/admin');
    const isEmployeePanel = location.pathname.startsWith('/employee');

    // Admin navigation items
    const adminNavItems = [
        {
            path: '/admin/dashboard',
            name: 'Dashboard',
            icon: BarChart3
        },
        {
            path: '/admin/tasks',
            name: 'Manage Tasks',
            icon: CheckSquare
        },
        {
            path: '/admin/tasks/create',
            name: 'Create Task',
            icon: Plus
        },
        {
            path: '/admin/employees',
            name: 'Team Members',
            icon: Users
        }
    ];

    // Employee navigation items
    const employeeNavItems = [
        // Coming soon...
    ];

    // Select navigation items based on user role and current path
    const navItems = isAdminPanel ? adminNavItems : employeeNavItems;
    const panelTitle = isAdminPanel ? 'Admin Panel' : 'Employee Portal';

  return (
    <div className='bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen p-4'>
        {/* App Header */}
        <div className='mb-6 text-center'>
            <h2 className='text-2xl font-bold text-gray-800'>
                Task Manager
            </h2>
        </div>

        {/* Profile Section */}
        <div className='mb-6 pb-4 border-b border-gray-200'>
            <div className='flex flex-col items-center'>
                {/* Default Profile Image */}
                <div className='w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-3'>
                    <Users className='w-8 h-8 text-gray-600' />
                </div>
                
                {/* Username */}
                <h3 className='font-semibold text-gray-800 text-sm mb-1'>
                    {user?.username || 'User'}
                </h3>
                
                {/* Email */}
                <p className='text-xs text-gray-500 break-all'>
                    {user?.email || 'user@example.com'}
                </p>

                {/* Role Badge */}
                <span className={`mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                    user?.role === 'ADMIN' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                }`}>
                    {user?.role || 'USER'}
                </span>
            </div>
        </div>

        {/* Navigation Links */}
        <nav className='space-y-1'>
            {navItems.map((item) => {
                const Icon = item.icon;
                return(
                    <NavLink 
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                isActive 
                                    ? 'bg-gray-100 text-gray-900 border-l-4 border-blue-500' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <Icon className='mr-3 h-5 w-5'/>
                        {item.name}
                    </NavLink>
                )
            })}
                
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className='flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 mt-4'
            >
                <LogOut className='mr-3 h-5 w-5'/>
                Logout
            </button>
        </nav>
    </div>
  )
}

export default Sidebar