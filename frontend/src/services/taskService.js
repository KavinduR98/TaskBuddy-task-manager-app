import api from "./api";

const taskService = {

    getAllTasks: async () => {
        try {
            const response = await api.get('/tasks');
            // console.log(response.data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch tasks' };
        }
    },

    deleteTask: async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            return { message: 'Task deleted successfully' };
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete task' };
        }
    },

    createTask: async (taskData) => {
        try {
            const response = await api.post('/tasks', taskData);
            return response.data;
        } catch (error) {   
            throw error.response?.data || { message: 'Failed to create task' };
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

    getTaskById: async (id) => {
        try {
            const response = await api.get(`/tasks/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch task' };
        }
    }, 

    updateTask: async (id, taskData) => {
        try {
            const response = await api.put(`/tasks/${id}`, taskData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update task' };
        }
    },

    getMyTasks: async (id) => {
        try {
            const response = await api.get(`/tasks/my-tasks/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || {message: 'Failed to fetch my tasks'}; 
        }
    },

    getMyTaskById: async (userId, taskId) => {
        try {
            const response = await api.get(`/tasks/my-tasks/${userId}/${taskId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch task details' };
        }
    },

    updateChecklistItem: async (taskId, itemId, itemData) => {
        try {
            const response = await api.put(`/tasks/${taskId}/checklist/${itemId}`, itemData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update checklist item' };
        }
    }
}

export default taskService;