import React, { useEffect, useState } from 'react'
import {ArrowLeft, X, Save} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import LoadingSpinner from '../common/LoadingSpinner';
import taskService from '../../services/taskService';

const TaskCreate = () => {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [employeeLoading, setEmployeeLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: '',
        employeeIds: []
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setEmployeeLoading(true);
            const response = await employeeService.getAllEmployees();

            // Filter only active employees
            const activeEmployees = response.filter(emp => emp.status === 'ACTIVE');
            setEmployees(activeEmployees);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError('Failed to load employees');
        } finally {
            setEmployeeLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }

    const handleEmployeeSelection = (employeeId) => {
        setFormData(prev => ({
            ...prev,
            employeeIds: prev.employeeIds.includes(employeeId)
            ? prev.employeeIds.filter(id => id !== employeeId)
            : [...prev.employeeIds, employeeId]
        }));
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) { // Checks if title is empty or just whitespace
            errors.title = 'Title is required';
        } else if (formData.title.length < 3) {
            errors.title = 'Title must be at least 3 characters';
        }

        if (formData.description && formData.description.length > 1000) {
            errors.description = 'Description must not exceed 1000 characters';
        }

        if (formData.dueDate) {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
            if (formData.dueDate < today) {  // Compare input date with today's date
                errors.dueDate = 'Due date must be in the future';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleCancel = () => {
        navigate('/dashboard/tasks');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError('');

            const taskData = {
                ...formData,
                employeeIds: formData.employeeIds.length > 0 ? formData.employeeIds : []
            };

            await taskService.createTask(taskData);
            navigate('/dashboard/tasks');
        } catch (error) {
            console.error('Error creating task:', error);
            if (error.response?.data?.validationErrors) {
                setValidationErrors(error.response.data.validationErrors);
            } else {
                setError(error.response?.data?.message || 'Failed to create task');
            }
        } finally {
            setLoading(false);
        }
    }

    if (employeeLoading){
        return <LoadingSpinner />
    }

  return (
    <div className='p-6'>
        <div className='max-w-2xl mx-auto'>
            <div className="flex items-center mb-6">
                <button
                    onClick={handleCancel}
                    className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                    {error}
                </div>
            )}

            <form className='bg-white shadow-md rounded-lg p-6' onSubmit={handleSubmit}>
                <div className='space-y-6'>
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                validationErrors.title ? 'border-red-500' : 'border-gray-300' 
                            }`}
                            placeholder="Enter task title"
                        />
                        {validationErrors.title && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
                        )}
                    </div>
                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                validationErrors.description ? 'border-red-500' : 'border-gray-300' 
                            }`}
                            placeholder="Enter task description"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            {formData.description.length}/1000 characters
                        </p>
                        {validationErrors.description && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                        )}
                    </div>

                    {/* Status and Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Status *
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                Priority *
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                validationErrors.dueDate ? 'border-red-500' : 'border-gray-300' 
                            }`}
                        />
                        {validationErrors.dueDate && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.dueDate}</p>
                        )}
                    </div>

                    {/* Assign Employees */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Assign to Employees
                        </label>
                    
                        <div className='border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto'>
                            {employees.length === 0 ? (
                                <p className='text-gray-500 text-sm'>No active employees available</p>
                            ) : (
                                <div className='space-y-2'>
                                    {employees.map((employee) => (
                                        <label key={employee.id} className='flex items-center'>
                                            <input 
                                                type="checkbox"
                                                checked={formData.employeeIds.includes(employee.id)}
                                                onChange={() => handleEmployeeSelection(employee.id)}
                                                className='mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'    
                                            />
                                            <span className='text-sm text-gray-700'>
                                                {employee.name} - {employee.department} - {employee.position}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <p className='mt-1 text-sm text-gray-500'>
                            {formData.employeeIds.length} employee(s) selected
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2 transition-colors"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:bg-indigo-400"
                    >
                        <Save className="h-4 w-4" />
                        {loading ? 'Creating...' : 'Create Task'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default TaskCreate