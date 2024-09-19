import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // נתחיל כלא מחובר

    const handleLogin = () => {
        setIsAuthenticated(true); // עדכון התחברות
    };

    const handleLogout = () => {
        setIsAuthenticated(false); // עדכון יציאה
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
