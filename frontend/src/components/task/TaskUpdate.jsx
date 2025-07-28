import React, {useState, useEffect} from 'react'
import { Save, X } from 'lucide-react';
import { useNavigate, useParams  } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import taskService from '../../services/taskService';
import LoadingSpinner from '../common/LoadingSpinner'


const TaskUpdate = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: '',
        employeeIds: []
    });
    const [error, setError] = useState('');
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});
   
    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setInitialLoading(true);
            const [task, allEmployees] = await Promise.all([
                taskService.getTaskById(id),
                employeeService.getAllEmployees(),
            ]);

            const activeEmployees = allEmployees.filter(emp => emp.status === 'ACTIVE');
            setEmployees(activeEmployees);

            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'PENDING',
                priority: task.priority || 'MEDIUM',
                dueDate: task.dueDate || '',
                employeeIds: task.assignedEmployees?.map(emp => emp.id) || [],
            });
        } catch (error) {
            console.error('Error initializing form:', error);
            setError('Failed to load task or employee data');
        } finally {
            setInitialLoading(false);
        }
    };

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
    };

    const handleEmployeeSelection = (employeeId) => {
        setFormData(prev => ({
            ...prev,
            employeeIds: prev.employeeIds.includes(employeeId)
                ? prev.employeeIds.filter(id => id !== employeeId)
                : [...prev.employeeIds, employeeId]
        }));
    };

    const validateForm = () => {
        const errors = {};
        const {title, description, status, priority, dueDate} = formData;
        
        if (!title.trim()) {
            errors.title = 'Title is required';
        } else if (title.length < 3) {
            errors.title = 'Title must be at least 3 characters';
        }

        
        if (!description.trim()) {
            errors.description = 'Description is required';
        } else if (description.length > 1000) {
            errors.description = 'Description must not exceed 1000 characters';
        }

        if (!status) {
            errors.status = 'Status is required';
        }

        if (!priority) {
            errors.priority = 'Priority is required';
        }

        if (!dueDate) {
            errors.dueDate = 'Due date is required';
        } else {
            const today = new Date().toISOString().split('T')[0];
            if (dueDate < today) {
                errors.dueDate = 'Due date must be in the future';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

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

            await taskService.updateTask(id, taskData);
            navigate('/admin/tasks');
        } catch (error) {
            console.error('Error updating task:', error);
            if (error.response?.data?.validationErrors) {
                setValidationErrors(error.response.data.validationErrors);
            } else {
                setError(error.response?.data?.message || 'Failed to update task');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        navigate('/admin/tasks');
    };

    if (initialLoading) {
        return <LoadingSpinner />;
    }

  return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="max-w-8xl mx-auto">
                <h1 className="text-lg font-bold text-gray-900 mb-4">
                    Update Task
                </h1>

                {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
                    {error}
                </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left side */}
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter task title"
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-indigo-500 ${
                                        validationErrors.title ? "border-red-500" : "border-gray-300"
                                    }`} 
                                />
                                {validationErrors.title && (
                                <p className="text-sm text-red-600 mt-1">
                                    {validationErrors.title}
                                </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter task description"
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-indigo-500 ${
                                        validationErrors.description ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                <p className="text-sm text-gray-500">
                                    {formData.description.length}/1000 characters
                                </p>
                                {validationErrors.description && (
                                <p className="text-sm text-red-600 mt-1">
                                    {validationErrors.description}
                                </p>
                                )}
                            </div>

                            {/* Status & Priority */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                                </div>
                                <div>
                                <label
                                    htmlFor="priority"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Priority *
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label
                                    htmlFor="dueDate"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-indigo-500 ${
                                        validationErrors.dueDate
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                                />
                                {validationErrors.dueDate && (
                                <p className="text-sm text-red-600 mt-1">
                                    {validationErrors.dueDate}
                                </p>
                                )}
                            </div>
                        </div>

                        {/* Right side - Assign employees */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign to Employees
                            </label>
                            <div className="border border-gray-300 rounded-md p-3 max-h-72 overflow-y-auto">
                                {employees.length === 0 ? (
                                <p className="text-gray-500 text-sm">
                                    No active employees available
                                </p>
                                ) : (
                                <div className="space-y-2">
                                    {employees.map((emp) => (
                                    <label key={emp.id} className="flex items-center">
                                        <input
                                        type="checkbox"
                                        checked={formData.employeeIds.includes(emp.id)}
                                        onChange={() => handleEmployeeSelection(emp.id)}
                                        className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">
                                        {emp.name} - {emp.department} - {emp.position}
                                        </span>
                                    </label>
                                    ))}
                                </div>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                {formData.employeeIds.length} employee(s) selected
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {loading ? 'Updating...' : 'Update Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TaskUpdate