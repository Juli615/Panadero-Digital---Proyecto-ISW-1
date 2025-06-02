const BASE_URL = 'http://localhost:8080/api';

export const api = {
    getAuthHeader() {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    async handleResponse(response) {
        if (response.status === 403) {
            // Si recibimos un 403, el token podría ser inválido
            localStorage.removeItem('token');
            throw new Error('Sesión expirada o inválida');
        }
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error en la petición');
        }
        return response.json();
    },

    get: async (endpoint) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    ...api.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            });
            return await api.handleResponse(response);
        } catch (error) {
            console.error(`Error en GET ${endpoint}:`, error);
            throw error;
        }
    },

    post: async (endpoint, data) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    ...api.getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await api.handleResponse(response);
        } catch (error) {
            console.error(`Error en POST ${endpoint}:`, error);
            throw error;
        }
    },

    // Método específico para login que no requiere token
    login: async (credentials) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            const data = await api.handleResponse(response);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }
}; 