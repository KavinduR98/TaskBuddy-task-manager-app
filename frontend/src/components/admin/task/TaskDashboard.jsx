import React, { useEffect, useState } from 'react'
import taskService from '../../../services/taskService';
import LoadingSpinner from '../../common/LoadingSpinner';
import TaskCard from './TaskCard';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TaskDashboard = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tasks, settasks] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [filteredTasks, setFilteredTasks] = useState([])

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(12);

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        filterTasks();

        // Reset to first page when filter changes
        setCurrentPage(1);
    }, [tasks, activeFilter]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getAllTasks();
            settasks(data);
        } catch (error) {
            toast.error(error.message || 'failed to fetch tasks')
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

    // Pagination calculations
    const totalTasks = filteredTasks.length;
    const totalPages = Math.ceil(totalTasks / tasksPerPage);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);


    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        
        return pageNumbers;
    };

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

        <div className='flex justify-between items-center text-sm text-gray-600'>
            <p>
                Showing {indexOfFirstTask + 1} to {Math.min(indexOfLastTask, totalTasks)} of {totalTasks} tasks
            </p>
            {totalPages > 1 && (
                <p>
                    Page {currentPage} of {totalPages}
                </p>
            )}
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

        {/* Pagination buttons */}
        {totalPages > 1 && (
            <div className='flex justify-center items-center space-x-2 mt-6'>
                {/* Previous Button */}
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    Previous
                </button>

                {/* Page Numbers */}
                <div className='flex space-x-1'>
                    {getPageNumbers().map((pageNum, index) => (
                        <React.Fragment key={index}>
                            {pageNum === '...' ? (
                                <span className='px-3 py-2 text-sm text-gray-500'>...</span>
                            ) : (
                                <button
                                    onClick={() => handlePageClick(pageNum)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        currentPage === pageNum
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === totalPages 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    Next
                </button>
            </div>
        )}
    </div>
  )
}

export default TaskDashboard