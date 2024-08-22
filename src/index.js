import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BudgetProvider } from './Context/BudgetContext';
import { UserProvider } from './Context/UserContext';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <BudgetProvider>
        <UserProvider>
            <App />
        </UserProvider>
    </BudgetProvider>
);