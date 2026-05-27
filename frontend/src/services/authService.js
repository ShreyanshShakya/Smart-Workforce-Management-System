import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

export const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        const decoded = jwtDecode(response.data.accessToken);
        // Assuming role and sub(email) are in the token claims
        const userRole = decoded.role || "EMPLOYEE"; // Default/Fallback
        const userEmail = decoded.sub || email;
        localStorage.setItem("role", userRole);
        localStorage.setItem("email", userEmail);
    }
    return response.data;
};

export const register = async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password });
    return response.data;
};

export const logout = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            // Best effort to invalidate token on server
            await api.post("/auth/logout", { refreshToken });
        }
    } catch (error) {
        console.error("Failed to logout on server", error);
    } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        window.location.href = "/";
    }
};

export const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return {
            email: decoded.sub || localStorage.getItem("email"),
            role: decoded.role || localStorage.getItem("role")
        };
    } catch {
        return null;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!token && !refreshToken) return false;

    // If there's a refresh token, assume authenticated until the API says otherwise
    if (refreshToken) return true;

    try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            // Only token exists and it's expired
            logout();
            return false;
        }
        return true;
    } catch {
        return false;
    }
};
