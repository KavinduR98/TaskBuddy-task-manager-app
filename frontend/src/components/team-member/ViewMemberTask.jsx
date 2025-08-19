import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner';
import { useNavigate, useParams } from 'react-router-dom';
import taskService from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { PRIORITY_COLORS, STATUS_COLORS } from '../../utils/constants';
import toast from 'react-hot-toast';

const ViewMemberTask = () => {

    const { id: taskId } = useParams();
    const { user } = useAuth();
    const userId = user.id;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [task, setTask] = useState(null);
    const [checklistItems, setChecklistItems] = useState([]);

    useEffect(() => {
        if (userId && taskId) {
            fetchTask();
        }
    }, [userId, taskId]);

    const fetchTask = async () => {
        try {
            setInitialLoading(true);
            const taskData = await taskService.getMyTaskById(userId, taskId);
            setTask(taskData);

            setChecklistItems(
                taskData.checklistItems?.map((item) => ({
                    id: item.id,
                    text: item.text,
                    completed: item.completed
                })) || []
            );
        } catch (error) {
            console.error('Error fetching task:', error);
            toast.error('Failed to load task data. You may not have access to this task.');
        } finally {
            setInitialLoading(false);
        }
    }

    const handleChecklistToggle = async (itemId) => {
        try {
            setLoading(true);

            // Find current state of this item
            const currentItem = checklistItems.find(item => item.id === itemId);
            if (!currentItem) return;

            const newCompletedStatus = !currentItem.completed;
            
            // Update local state optimistically
            setChecklistItems(prev =>
                prev.map(item =>
                    item.id === itemId
                        ? { ...item, completed: !item.completed }
                        : item
                )
            );
            
            const updatedItem  = await taskService.updateChecklistItem(taskId, itemId, {
                completed: newCompletedStatus
            });

            toast.success(newCompletedStatus ? "Item checked!" : "Item unchecked!");

            // Fetch updated task to sync status & startDate from backend
            const updatedTask = await taskService.getMyTaskById(userId, taskId);
            setTask(updatedTask);
            console.log(updatedTask);
            
            setChecklistItems(
                updatedTask.checklistItems?.map((item) => ({
                    id: item.id,
                    text: item.text,
                    completed: item.completed
                })) || []
            );
        } catch (error) {
            console.error('Error updating checklist item:', error);
            toast.error('Failed to update checklist item');

            // Revert the optimistic update
            fetchTask();
        } finally {
            setLoading(false);
        }
    }

    const handleGoBack = () => {
        navigate(-1); // Goes back to previous page
    }

    const getInitials = (fullName) => {
        return fullName
            .split(' ')
            .map(name => name.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (initialLoading) {
        return <LoadingSpinner />
    }

    if (!task) {
        return (
            <div className='bg-white shadow-md rounded-lg p-6'>
                <div className='text-center text-gray-500'>
                    Task not found
                </div>
            </div>
        )
    }

    return (
        <div className='bg-white shadow-md rounded-lg p-6'>
            <div className='max-w-8xl mx-auto'>
                {/* Header */}
                <div className='flex items-center gap-4 mb-6'>
                    <button
                        onClick={handleGoBack}
                        className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer'
                    >
                        <ArrowLeft className='h-5 w-5' />
                        Back
                    </button>
                    <h1 className='text-lg font-bold text-gray-900'>
                        Task Details
                    </h1>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Left side - Task details */}
                    <div className='space-y-4'>
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                                {task.title}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 min-h-[100px]">
                                {task.description}
                            </div>
                        </div>

                        {/* Status & Priority */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <span className={`inline-flex px-3 py-1 rounded-md text-sm font-medium ${STATUS_COLORS[task.status]}`}>
                                    {task.status?.replace('_', ' ')}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority
                                </label>
                                <span className={`inline-flex px-3 py-1 rounded-md text-sm font-medium ${PRIORITY_COLORS[task.priority]}`}>
                                    {task.priority}
                                </span>
                            </div>
                        </div>

                        {/* TODO Checklist */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                TODO Checklist
                            </label>
                            {checklistItems.length === 0 ? (
                                <p className='text-gray-500'>No checklist items</p>
                            ) : (
                                <div className='space-y-2'>
                                    {checklistItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className='flex items-center gap-3 p-2 border border-gray-200 rounded-md hover:bg-gray-50'
                                        >
                                            <button
                                                onClick={() => handleChecklistToggle(item.id)}
                                                disabled={loading}
                                                className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 ${item.completed
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                {item.completed && (
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                            <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                                {item.text}
                                            </span>
                                        </div>
                                    ))}
                                    <p className="mt-1 text-sm text-gray-500">
                                        {checklistItems.filter(item => item.completed).length} of {checklistItems.length} items completed
                                    </p>
                                </div>

                            )}
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                            </div>
                        </div>

                        {/* Due Date */}
                        { task.startDate && ( 
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                                    {task.startDate ? new Date(task.startDate).toLocaleDateString() : 'Not set'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right side - Assigned members */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-3'>
                            Assigned Members
                        </label>
                        {!task.assignedUsers || task.assignedUsers.length === 0 ? (
                            <div className='text-gray-500 text-sm bg-gray-50 p-4 rounded-md border border-gray-200'>
                                No members assigned to this task
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {task.assignedUsers.map((user) => (
                                    <div key={user.id} className='flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-gray-50'>
                                        {/* Avatar with name */}
                                        <div className='flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full font-medium text-sm'>
                                            {getInitials(user.fullName)}
                                        </div>
                                        {/* User info */}
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {user.fullName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewMemberTask