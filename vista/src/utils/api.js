const BASE_URL = 'http://localhost:8080/api';

export const api = {
    getAuthHeader() {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    async handleResponse(response) {
        if (response.status === 401 || response.status === 403) {
            // Si recibimos un 401 o 403, el token es inválido o expiró
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
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

    put: async (endpoint, data) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    ...api.getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await api.handleResponse(response);
        } catch (error) {
            console.error(`Error en PUT ${endpoint}:`, error);
            throw error;
        }
    },

    delete: async (endpoint) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    ...api.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            });
            return await api.handleResponse(response);
        } catch (error) {
            console.error(`Error en DELETE ${endpoint}:`, error);
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
            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }
}; 