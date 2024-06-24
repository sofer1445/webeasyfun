import React, { createContext, useState } from 'react';

// יצירת ה-context
export const UserContext = createContext();

// יצירת ה-provider
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};