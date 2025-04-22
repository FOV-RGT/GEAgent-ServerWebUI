import axios from 'axios';
import { useAuthStore } from '@/stores/auth';


const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000
})

api.defaults.withCredentials = true;

api.interceptors.request.use(config => {
    const authStore = useAuthStore()
    if (authStore.token) {
        config.headers['Authorization'] = `Bearer ${authStore.token}`
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(res => {
    return res
}, error => {
    console.error('Error:', error);
    return Promise.reject(error.response);
})

export default api