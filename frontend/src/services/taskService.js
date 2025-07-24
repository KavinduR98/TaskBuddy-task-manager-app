import api from "./api";

const taskService = {

    getAllTasks: async () => {
        try {
            const response = await api.get('/tasks');
            console.log(response.data);
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch tasks' };
        }
    },

    getTaskStats: (tasks) => {
        const stats = {
            PENDING: 0,
            IN_PROGRESS: 0,
            COMPLETED: 0,
            CANCELLED: 0,
            total: tasks.length
        };

        tasks.forEach(task => {
        if (stats.hasOwnProperty(task.status)) {
            stats[task.status]++;
        }
        });

        return stats;
    },
}

export default taskService;