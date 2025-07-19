import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(); // Create AuthContext

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        token: localStorage.getItem('token') || '',
        userId: localStorage.getItem('userId') || '',
        role: localStorage.getItem('role') || '', // Initial role from localStorage
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false); // Simulate auth check
    }, []);

    const login = (token, userId, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('role', role); // Save role to localStorage

        setUser({ token, userId, role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');

        setUser({ token: '', userId: '', role: '' });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext); // Custom hook to access context
};
