import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

export const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        const decoded = jwtDecode(response.data.token);
        // Assuming role and sub(email) are in the token claims
        const userRole = decoded.role || "EMPLOYEE"; // Default/Fallback
        const userEmail = decoded.sub || email;
        localStorage.setItem("role", userRole);
        localStorage.setItem("email", userEmail);
    }
    return response.data;
};

export const register = async (name, email, password, role) => {
    const response = await api.post("/users", { name, email, password, role });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
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
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            logout();
            return false;
        }
        return true;
    } catch {
        return false;
    }
};
