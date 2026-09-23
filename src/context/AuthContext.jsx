import { createContext, useContext, useState, useEffect } from 'react';
import { authLogin, authRegister, getMe } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token') || null);
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            getMe(token).then(userData => {
                setUser(userData);
                setIsGuest(false);
            }).catch(() => {
                setToken(null);
                setUser(null);
                localStorage.removeItem('access_token');
            }).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const data = await authLogin(email, password);
        setToken(data.access_token);
        localStorage.setItem('access_token', data.access_token);
        setIsGuest(false);
        // user state will be updated via useEffect
    };

    const register = async (userData) => {
        await authRegister(userData);
        // User must login after register
    };

    const loginAsGuest = () => {
        setIsGuest(true);
        setUser(null);
        setToken(null);
        localStorage.removeItem('access_token');
    };

    const logout = () => {
        setIsGuest(false);
        setUser(null);
        setToken(null);
        localStorage.removeItem('access_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, isGuest, loading, login, register, loginAsGuest, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
