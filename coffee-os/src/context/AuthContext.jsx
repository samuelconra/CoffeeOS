import { createContext, useState, useEffect } from 'react';
import { loginUser, signupUser } from '../api/authService';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                localStorage.removeItem('user');
            }
            setLoading(false);
        };
        
        initializeAuth();
    }, []);

    const login = async (email, password) => {
        const userData = await loginUser(email, password);
        localStorage.setItem('user', JSON.stringify(userData.user));
        setUser(userData.user);
    };

    const signup = async (username, fullName, email, password) => {
        const userData = await signupUser(username, fullName, email, password);
        localStorage.setItem('user', JSON.stringify(userData.user));
        setUser(userData.user);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
    };

    if (loading) {
        return null;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
