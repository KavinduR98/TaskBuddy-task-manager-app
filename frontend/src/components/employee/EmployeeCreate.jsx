import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save  } from 'lucide-react'

const EmployeeCreate = () => {

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  return (
    <div className='space-y-6'>
        {/* Header */}
        <div className="flex items-center space-x-4">
            <button
                onClick={() => navigate('/dashboard/employees')}
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
                <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Employee</h1>
        </div>
        {/* Form */}
        <div className='bg-white rounded-lg shadow max-w-2xl'>
            <form className='p-6 space-y-6'>
                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md'>
                        {error}
                    </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-2'>
                            Full Name *
                        </label>
                        <input 
                            type="text" 
                            id='name'
                            name='name'
                            required
                            placeholder='Enter full name'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                            />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                        </label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter department"
                        />
                    </div>

                    <div>
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                            Position
                        </label>
                        <input
                            type="text"
                            id="position"
                            name="position"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter position"
                        />
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            Status *
                        </label>
                        <select
                            id="status"
                            name="status"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value=""></option>
                        </select>
                     </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/employees')}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center transition-colors"
                    >
                    <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Creating...' : 'Create Employee'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default EmployeeCreate