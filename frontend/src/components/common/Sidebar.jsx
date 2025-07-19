import { CheckSquare, Home, Users } from 'lucide-react';
import React from 'react'
import { NavLink } from 'react-router-dom';

const Sidebar = () => {

    const navItems = [
        {
            path: '/dashboard/employees',
            name: 'Employees',
            icon: Users
        },
        {
            path: '/dashboard/tasks',
            name: 'Tasks',
            icon: CheckSquare
        }
    ];

  return (
    <div className='bg-gray-800 text-white w-64 min-h-screen p-4'>
        <div className='mb-8'>
            <h2 className='text-xl font-bold flex items-center'>
                <Home className='mr-2'/>
                Task Manager
            </h2>
        </div>

        <nav className='space-y-2'>
            {navItems.map((item) => {
                const Icon = item.icon;
                return(
                    <NavLink 
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`
                        }
                    >
                        <Icon className='mr-3 h-5 w-5'/>
                        {item.name}
                    </NavLink>
                )
            })}
        </nav>
    </div>
  )
}

export default Sidebar