import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (originalRequest.url.includes("/auth/login") || originalRequest.url.includes("/auth/refresh")) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                isRefreshing = false;
                // Force logout
                localStorage.clear();
                if (window.location.pathname !== "/") window.location.href = "/";
                return Promise.reject(error);
            }

            try {
                // We use axios directly here to avoid interceptor loops
                const rs = await axios.post((import.meta.env.VITE_API_URL || "http://localhost:8081/api") + "/auth/refresh", {
                    refreshToken: refreshToken
                });
                
                const newAccessToken = rs.data.accessToken;
                localStorage.setItem("token", newAccessToken);
                
                // If backend rotated the refresh token, save it
                if (rs.data.refreshToken) {
                    localStorage.setItem("refreshToken", rs.data.refreshToken);
                }

                api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                
                processQueue(null, newAccessToken);
                return api(originalRequest);
                
            } catch (_error) {
                processQueue(_error, null);
                // Refresh token expired or invalid
                localStorage.clear();
                if (window.location.pathname !== "/") window.location.href = "/";
                return Promise.reject(_error);
            } finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;