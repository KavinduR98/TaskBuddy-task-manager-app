import api from "./api"

const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, fullName, email, role, id } = response.data;

            // Store token and user info
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ fullName, email, role, id }));

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        try {
            // Check if token is expired
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            return payload.exp > currentTime;
        } catch (error) {
            return false;
        }
    }
};

export default authService;
