/**
 * Prepare data for Task Distribution Pie Chart
 * @param {Object} taskStats - Task statistics object containing counts for each status
 * @returns {Object} Chart.js compatible data object for pie chart
 */
export const getTaskDistributionData = (taskStats) => {
    const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    const data = statuses.map(status => taskStats[status] || 0);
    
    // Extract background colors
    const getBackgroundColor = (status) => {
        switch (status) {
            case 'PENDING':
                return '#2563EB'; // blue-500
            case 'IN_PROGRESS':
                return '#A78BFA'; // purple-500
            case 'COMPLETED':
                return '#10B981'; // green-500
            default:
                return '#6B7280'; // gray-500
        }
    };

    return {
        labels: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        datasets: [
            {
                data: data,
                backgroundColor: statuses.map(status => getBackgroundColor(status)),
                borderColor: statuses.map(status => getBackgroundColor(status)),
                borderWidth: 1,
            }
        ]
    };
};

/**
 * Prepare data for Task Priority Bar Chart
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Chart.js compatible data object for bar chart
 */
export const getTaskPriorityData = (tasks) => {
    const priorities = ['LOW', 'MEDIUM', 'HIGH'];
    const priorityCounts = priorities.map(priority => {
        return tasks.filter(task => task.priority === priority).length;
    });

    // Extract background colors from PRIORITY_COLORS
    const getBackgroundColor = (priority) => {
        switch (priority) {
            case 'LOW':
                return '#10B981'; // green-500
            case 'MEDIUM':
                return '#F59E0B'; // yellow-500
            case 'HIGH':
                return '#EF4444'; // red-500
            default:
                return '#6B7280'; // gray-500
        }
    };

    return {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
            {
                label: 'Number of Tasks',
                data: priorityCounts,
                backgroundColor: priorities.map(priority => getBackgroundColor(priority)),
                borderColor: priorities.map(priority => getBackgroundColor(priority)),
                borderWidth: 1,
            }
        ]
    };
};