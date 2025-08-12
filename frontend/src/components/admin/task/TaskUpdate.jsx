import React, {useState, useEffect} from 'react'
import { Save, Trash2, X } from 'lucide-react';
import { useNavigate, useParams  } from 'react-router-dom';
import memberService from '../../../services/memberService';
import taskService from '../../../services/taskService';
import LoadingSpinner from '../../common/LoadingSpinner'
import toast from 'react-hot-toast';

const TaskUpdate = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: '',
        userIds: []
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});
    const [checklistItems, setChecklistItems] = useState([]);
   
    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setInitialLoading(true);
            const [task, allUsers] = await Promise.all([
                taskService.getTaskById(id),
                memberService.getAllUsers(),
            ]);

            setUsers(allUsers);
            console.log(task);
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'PENDING',
                priority: task.priority || 'MEDIUM',
                dueDate: task.dueDate || '',
                userIds: task.assignedUsers?.map(user => user.id) || [],
            });
            setChecklistItems(task.checklistItems || []);
        } catch (error) {
            console.error('Error initializing form:', error);
            toast.error("Failed to load task or employee data");
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

    const handleUserSelection = (userId) => {
        setFormData(prev => ({
            ...prev,
            userIds: prev.userIds.includes(userId)
                ? prev.userIds.filter(id => id !== userId)
                : [...prev.userIds, userId]
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

            const taskData = {
                ...formData,
                userIds: formData.userIds.length > 0 ? formData.userIds : []
            };

            await taskService.updateTask(id, taskData);
            toast.success("Task updated successfully!")
            
            setTimeout(() => {
                navigate('/admin/tasks');
            },800);
        } catch (error) {
            console.error('Error updating task:', error);
            if (error.response?.data?.validationErrors) {
                setValidationErrors(error.response.data.validationErrors);
                toast.error("Some fields have errors. Please check and try again.");
            } else {
                toast.error(error.response?.data?.message || "Failed to update task. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    const hasCompletedItems = checklistItems.some(item => item.completed);

    const handleDelete = async () => {

        if (hasCompletedItems) {
            toast.error("Cannot delete task with completed checklist items.");
            return;
        }

        confirmDelete(async () => {
            try {
                await taskService.deleteTask(id);
                toast.success("Task deleted successfully!");
                
                setTimeout(() => {
                    navigate('/admin/tasks');
                },800);
            } catch (error) {
                toast.error("Failed to delete task.");
            }
        });
    }

    const confirmDelete = (onConfirm) => {
        toast((t) => (
            <div>
                <p>Are you sure you want to delete this task?</p>
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            onConfirm();
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-300 px-3 py-1 rounded"
                    >
                        No
                    </button>
                </div>
            </div>
        ), { duration: 4000 });
    };

    const handleCancel = () => {
        navigate('/admin/tasks');
    };

    if (initialLoading) {
        return <LoadingSpinner />;
    }

  return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="max-w-8xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg font-bold text-gray-900">
                        Update Task
                    </h1>
                     <button
                        type="button"
                        onClick={handleDelete}
                        disabled={hasCompletedItems}
                        className={`border px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors ${
                            hasCompletedItems 
                                ? 'text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed' 
                                : 'text-red-600 hover:text-red-700 border-red-200 hover:border-red-300'
                        }`}
                        title={hasCompletedItems ? "Cannot delete task with completed checklist items" : "Delete task"}
                    >
                        <Trash2 className='h-4 w-4'/>
                        Delete
                    </button>
                </div>

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

                            {/* TODO Checklist */}
                            {checklistItems && checklistItems.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        TODO Checklist (Read Only)
                                    </label>
                                    <div className="space-y-2">
                                        {checklistItems.map((item, index) => (
                                            <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                                                <div 
                                                    className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${
                                                        item.completed 
                                                            ? 'bg-green-500 border-green-500' 
                                                            : 'bg-white border-gray-300'
                                                    }`}
                                                >
                                                    {item.completed && (
                                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span 
                                                    className={`text-sm flex-1 ${
                                                        item.completed 
                                                            ? 'text-gray-500 line-through' 
                                                            : 'text-gray-700'
                                                    }`}
                                                >
                                                    {item.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {checklistItems.filter(item => item.completed).length} of {checklistItems.length} items completed
                                    </p>
                                </div>
                            )}

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

                        {/* Right side - Assign members */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign to Members
                            </label>
                            <div className="border border-gray-300 rounded-md p-3 max-h-72 overflow-y-auto">
                                {users.length === 0 ? (
                                <p className="text-gray-500 text-sm">
                                    No active users available
                                </p>
                                ) : (
                                <div className="space-y-2">
                                    {users.map((user) => (
                                    <label key={user.id} className="flex items-center">
                                        <input
                                        type="checkbox"
                                        checked={formData.userIds.includes(user.id)}
                                        onChange={() => handleUserSelection(user.id)}
                                        className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">
                                        {user.fullName} - {user.email}
                                        </span>
                                    </label>
                                    ))}
                                </div>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                {formData.userIds.length} member(s) selected
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed cursor-pointer"
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