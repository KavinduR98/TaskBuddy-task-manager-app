import React from "react";
import { STATUS_COLORS } from "../../../utils/constants";

const RecentTaskTable = ({ tasks }) => {

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusColor = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`px-2 py-1 rounded-md text-xs font-medium ${statusColor}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityColors = {
        HIGH: "bg-red-100 text-red-800",
        MEDIUM: "bg-yellow-100 text-yellow-800",
        LOW: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-md text-xs font-medium ${
          priorityColors[priority] || "bg-gray-100 text-gray-800"
        }`}
      >
        {priority}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Title
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Priority
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Created On
                </th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {tasks && tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {task.title}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {getStatusBadge(task.status)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {getPriorityBadge(task.priority)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {formatDate(task.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                    <tr>
                        <td colSpan="4" className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
                        No tasks found
                        </td>
                    </tr>
                )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTaskTable;
