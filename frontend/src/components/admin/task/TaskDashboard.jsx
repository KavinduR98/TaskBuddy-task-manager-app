import React, { useEffect, useState } from 'react'
import taskService from '../../../services/taskService';
import LoadingSpinner from '../../common/LoadingSpinner';
import TaskCard from './TaskCard';
import { useNavigate } from 'react-router-dom';

const TaskDashboard = () => {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [tasks, settasks] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [filteredTasks, setFilteredTasks] = useState([])

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [tasks, activeFilter]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getAllTasks();
            settasks(data);
        } catch (error) {
            setError(error.message || 'failed to fetch tasks')
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
        navigate(`/admin/tasks/edit/${taskId}`);
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

                {/* Download report button */}
                <button
                    className='bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors'
                >
                    Download Report
                </button>
            </div>
        </div>

        {/* Error message */}
        {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md'>
                {error}
            </div>
        )}

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

export default TaskDashboard