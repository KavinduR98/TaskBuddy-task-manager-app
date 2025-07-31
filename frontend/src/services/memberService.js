import api from './api';

const memberService = {
    getAllUsers: async () => {
        try {
            const response = await api.get('/admin/team-members');
            return response.data;
        } catch (error) {
            throw error.response?.data || {message: 'Failed to fetch users'}
        }
    }
}

export default memberService;