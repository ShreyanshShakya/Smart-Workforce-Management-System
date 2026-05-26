import { createContext, useContext, useState, useEffect } from 'react';
import { login as authLogin, register as authRegister, logout as authLogout, getCurrentUser, isAuthenticated as checkAuth } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = () => {
            const isAuth = checkAuth();
            setIsAuthenticated(isAuth);
            if (isAuth) {
                setUser(getCurrentUser());
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const login = async (email, password) => {
        const data = await authLogin(email, password);
        setToken(data.token);
        setIsAuthenticated(true);
        setUser(getCurrentUser());
        navigate('/dashboard');
        return data;
    };

    const register = async (name, email, password, role) => {
        return await authRegister(name, email, password, role);
    };

    const logout = () => {
        authLogout();
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
