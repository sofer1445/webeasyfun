import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BudgetProvider } from './Context/BudgetContext';
import { UserProvider } from './Context/UserContext'; // ייבוא של UserProvider

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <BudgetProvider>
            <UserProvider> {/* הוספת UserProvider כמעטפת לאפליקציה */}
                <App />
            </UserProvider>
        </BudgetProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();