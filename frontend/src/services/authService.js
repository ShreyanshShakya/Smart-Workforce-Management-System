import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

export const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("session_active", "true");
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
        if (localStorage.getItem("session_active")) {
            await api.post("/auth/logout", {});
        }
    } catch (error) {
        console.error("Failed to logout on server", error);
    } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("session_active");
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
    const sessionActive = localStorage.getItem("session_active");
    
    if (!token && !sessionActive) return false;

    // If session is active (cookie might exist), trust it until an API call fails
    if (sessionActive && !token) return true;

    try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            // Token is expired. We rely on the Axios interceptor to refresh it
            // on the next API call. So we still return true for now.
            return true;
        }
        return true;
    } catch {
        return false;
    }
};
