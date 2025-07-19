import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserCheck, UserX, UserMinus, Plus } from 'lucide-react';
import employeeService from '../../services/employeeService';
import LoadingSpinner from '../common/LoadingSpinner'

const EmployeeDashboard = () => {

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await employeeService.getAllEmployees();
            setEmployees(data);
        } catch (error) {
            setError(error.message || 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const stats = employeeService.getEmployeeStats(employees)

    const cardData = [
        {
            title: 'Active Employees',
            value: stats.ACTIVE,
            icon: UserCheck,
            color: 'bg-green-100 text-green-800',
            iconColor: 'text-green-600'
        },
        {
            title: 'Inactive Employees',
            value: stats.INACTIVE,
            icon: UserMinus,
            color: 'bg-yellow-100 text-yellow-800',
            iconColor: 'text-yellow-600'
        },
        {
            title: 'Terminated Employees',
            value: stats.TERMINATED,
            icon: UserX,
            color: 'bg-red-100 text-red-800',
            iconColor: 'text-red-600'
        }
    ];

    if (loading) {
        return <LoadingSpinner size="lg" text="Loading employees..." />;
    }

  return (
    <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold text-gray-900'>Employee Management</h1>
            <button
                onClick={() => navigate('/dashboard/employees/create')}
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors'
            >
                Add New Employee
            </button>
        </div>

        {/* Error message */}
        { error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md'>
                {error}
            </div>
        )}

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {cardData.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div key={index} className='bg-white rounded-lg shadow p-6'>
                        <div className='flex items-center'>
                            <div className={`p-3 rounded-full ${card.color}`}>
                                <Icon className={`h-6 w-6 ${card.iconColor}`}/>
                            </div>
                            <div className='ml-4'>
                                <p className='text-sm font font-medium text-gray-600'>{card.title}</p>
                                <p className='text-2xl font-bold text-gray-900'>{card.value}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
        
        {/* Employee Table */}
        <div className='bg-white rounded-lg shadow'>
            <div className='px-6 py-4 border-b border-gray-200'>
                <h2 className='text-lg font-medium text-gray-900'>All Employees</h2>
            </div>
            {/* Table component */}
        </div>
    </div>
  )
}

export default EmployeeDashboard