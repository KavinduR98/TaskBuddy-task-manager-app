import React from 'react'
import { STATUS_COLORS, PRIORITY_COLORS} from '../../utils/constants';

const TaskCard = ({ task, onClick }) => {

    const formatStatus = (status) => {
        if (!status) return 'N/A';
        return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1).toLowerCase();
    }

    const formatPriority = (priority) => {
        if (!priority) return 'N/A';
        return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    }

  return (
    <div 
        className='bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200'
        onClick={() => onClick(task.id)}
    >
        {/* Status and priority badges */}
        <div className='flex justify-between items-start mb-3'>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${STATUS_COLORS[task.status]}`}>
                {formatStatus(task.status)}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${PRIORITY_COLORS[task.priority]}`}>
                {formatPriority(task.priority)}
            </span>
        </div>

        {/* Title and description */}
        <div className='mb-3'>
            <h3 className='text-sm font-semibold text-gray-900 mb-1 line-clamp-2'>
                {task.title}
            </h3>
            <p className='text-xs text-gray-600 line-clamp-2'>
                {task.description || 'No description'}
            </p>
        </div>

        {/* Due date */}
        <div className='mb-3'>
            <p className='text-xs text-gray-500'>
                <span className='font-medium'>Due:</span> {task.dueDate ? formatDate(task.dueDate) : 'N/A'}
            </p>
        </div>

        {/* Assigned employees */}
        <div>
            {task.assignedEmployees && task.assignedEmployees.length > 0 ? (
                <div className='flex flex-wrap gap-1 items-center'>
                    {task.assignedEmployees.slice(0, 2).map((employee) => (
                        <span key={employee.id} className='bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded'>
                            {employee.name}
                        </span>
                    ))}
                    {task.assignedEmployees.length > 2 && (
                        <span className='text-xs text-gray-500'>
                            +{task.assignedEmployees.length - 2} more
                        </span>
                    )}
                </div>
            ) : (
                <span className='text-xs font-semibold text-yellow-800 bg-yellow-100 px-2 py-1 rounded-md'>
                    Unassigned
                </span>
            )}
        </div>
    </div>
  )
}

export default TaskCard