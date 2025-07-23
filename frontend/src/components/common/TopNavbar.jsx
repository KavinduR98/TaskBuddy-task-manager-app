import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, LogOut } from 'lucide-react';

const TopNavbar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

  return (
    <nav className='bg-white shadow-sm border-b border-gray-200 px-4 py-2'>
        <div className='flex justify-between items-center'>
            <div className='flex items-center'>
                <h1 className='text-xl font-semibold text-gray-800'></h1>
            </div>

            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                    <div className="flex items-center">
                        <User className="h-8 w-8 p-1 bg-gray-100 rounded-full mr-2" />
                        <span className="font-medium">{user?.username}</span>
                        <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{user?.username}</p>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </button>
                    </div>
                )}
            </div>
        </div>
    </nav>
  )
}

export default TopNavbar