import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Clock, CheckCircle, XCircle, Plus, Edit, Trash2 } from 'lucide-react';
import taskService from '../../services/taskService';
import LoadingSpinner from '../common/LoadingSpinner';
import DataTable from 'react-data-table-component';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants';

const TaskDashboard = () => {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);   
            const data = await taskService.getAllTasks();
            setTasks(data);
        } catch (error) {
            setError(error.message || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }

    const stats = taskService.getTaskStats(tasks);

    const cardData = [
        {
        title: 'Pending Tasks',
        value: stats.PENDING,
        icon: Clock,
        color: 'bg-blue-100 text-blue-800',
        iconColor: 'text-blue-600'
        },
        {
        title: 'In Progress',
        value: stats.IN_PROGRESS,
        icon: CheckSquare,
        color: 'bg-purple-100 text-purple-800',
        iconColor: 'text-purple-600'
        },
        {
        title: 'Completed',
        value: stats.COMPLETED,
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800',
        iconColor: 'text-green-600'
        },
        {
        title: 'Cancelled',
        value: stats.CANCELLED,
        icon: XCircle,
        color: 'bg-red-100 text-red-800',
        iconColor: 'text-red-600'
        }
    ];

    // DataTable columns configuration
    const columns = [
        {
            name: '#No',
            selector: row => row.id,
            sortable: true,
            grow: 1/4,
        },
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
            grow: 3,
            cell: row => <span className="font-semibold text-nowrap">{row.title}</span>,
        },
        {
            name: 'Due Date',
            selector: row => row.dueDate || 'N/A',
            sortable: true,
        },
        {
            name: 'Status',
            cell: row => (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[row.status]}`}>
                    {row.status}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Priority',
            cell: row => (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${PRIORITY_COLORS[row.priority]}`}>
                    {row.priority}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => navigate(`/dashboard/tasks/edit/${row.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow : true,
            button: true,
        },
    ];

    if (loading) {
        return <LoadingSpinner size="lg" text="Loading tasks..." />;
    }

  return (
    <div className='space-y-6'>
        {/* Header */}
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            <button
                onClick={() => navigate('/dashboard/tasks/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 flex items-center transition-colors"
            >
                <Plus className="mr-2 h-4 w-4" />
                Add New Task
            </button>
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
            </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardData.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-full ${card.color}`}>
                            <Icon className={`h-6 w-6 ${card.iconColor}`} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        </div>
                    </div>
                    </div>
                );
            })}
        </div>

        {/* Tasks DataTable */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
            <DataTable
                title="All Tasks"
                columns={columns}
                data={tasks}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30, 50]}
                highlightOnHover
                striped
                responsive
                // customStyles={customStyles}
                // subHeader
                // subHeaderComponent={SubHeaderComponent}
                noDataComponent={
                    <div className="p-6 text-center text-gray-500">
                        No tasks found...
                    </div>
                }
            />
        </div>
    </div>
  )
}

export default TaskDashboard