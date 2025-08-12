import React, { useEffect, useState } from 'react'
import taskService from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import TaskCard from '../admin/task/TaskCard';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyTasks = () => {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [filteredTasks, setFilteredTasks] = useState([])

    useEffect(() => {
        if (user?.id) {
            fetchMyTasks();
        }
    }, [user]);

    useEffect(() => {
        filterTasks();
    }, [tasks, activeFilter]);

    const fetchMyTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getMyTasks(user.id);
            setTasks(data);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch your tasks');
        } finally {
            setLoading(false);
        }
    }
    
    const filterTasks = () => {
        if (activeFilter === 'ALL') {
            setFilteredTasks(tasks);
        } else {    
            setFilteredTasks(tasks.filter(task => task.status === activeFilter));
        }
    }

    const handleCardClick = (taskId) => {
        navigate(`/member/tasks/edit/${taskId}`);
    }
    
    const stats = taskService.getTaskStats(tasks);

    const filterOptions = [
        { key: 'ALL', label: 'All', count: stats.total},
        { key: 'PENDING', label: 'Pending', count: stats.PENDING},
        { key: 'IN_PROGRESS', label: 'In Progress', count: stats.IN_PROGRESS},
        { key: 'COMPLETED', label: 'Completed', count: stats.COMPLETED},
    ];

    if (loading){
        return < LoadingSpinner size='lg' text='Loading tasks...' />
    }

  return (
    <div className='space-y-6'>
        {/* Header with filters */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <h1 className='text-2xl font-bold text-gray-800'>Manage Tasks</h1>

            {/* Filter buttons */}
            <div className='flex flex-wrap gap-2'>
                {filterOptions.map((option) => (
                    <button 
                        key={option.key}
                        onClick={() => setActiveFilter(option.key)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                            activeFilter === option.key ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {option.label}({option.count})
                    </button>
                ))}
            </div>
        </div>

        {/* Tasks grid */}
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                    <TaskCard 
                        key={task.id}
                        task={task}
                        onClick={handleCardClick}
                    />
                ))
            ) : (
                <div className='col-span-full text-center py-12 text-gray-500'>
                    <p>No tasks found for the selected filter.</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default MyTasks