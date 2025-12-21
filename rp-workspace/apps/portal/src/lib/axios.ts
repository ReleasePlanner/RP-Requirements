import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
    withCredentials: true, // For HttpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => {
        // NestJS Global TransformInterceptor wraps everything in { data: T }
        // We unwrap it here so the frontend receives T directly
        if (response.data && response.data.data && Object.keys(response.data).length <= 4) {
            // Basic check to ensure we are unwrapping the standard envelope
            // Keys are usually: data, statusCode, message, timestamp
            response.data = response.data.data;
        }
        return response;
    },
    (error) => {
        // Handle global errors (e.g. 401 Redirect)
        return Promise.reject(error);
    }
);

export default api;
