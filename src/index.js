import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { BudgetProvider } from './Context/BudgetContext';
import { UserProvider } from './Context/UserContext';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Router>
        <BudgetProvider>
            <UserProvider>
                <App />
            </UserProvider>
        </BudgetProvider>
    </Router>
);