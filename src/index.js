import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { BudgetProvider } from './Context/BudgetContext';
import { UserProvider } from './Context/UserContext';
import { AuthProvider } from './Context/AuthContext';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Router>
        <AuthProvider>
            <BudgetProvider>
                <UserProvider>
                    <App />
                </UserProvider>
            </BudgetProvider>
        </AuthProvider>
    </Router>
);
