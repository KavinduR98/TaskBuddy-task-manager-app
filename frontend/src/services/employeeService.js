import api from './api';

const employeeService = {
    getAllEmployees: async () => {
        try {
            const response = await api.get('/employees');
            return response.data;
        } catch (error) {
            throw error.response?.data || {message: 'Failed to fetch employees'}
        }
    },

    getEmployeeStats: (employees) => { 
        const stats = {
            ACTIVE: 0,
            INACTIVE: 0,
            TERMINATED: 0,
            total: employees.length
        };
        
        employees.forEach(employee => {
            if (stats.hasOwnProperty(employee.status)) {
                stats[employee.status]++;
            }
        });

        return stats;
    },

    deleteEmployee: async (id) => {
        try {
            await api.delete(`/employees/${id}`);
            return { message: 'Employee deleted successfully' };
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete employee' };
        }
    }
}

export default employeeService;