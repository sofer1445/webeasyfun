import React, { useContext, useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import SignUp from './components/pages/SignUp';
import AboutUs from './components/pages/AboutUs';
import Contact from './components/pages/Contact';
import EventPlanning from './components/pages/EventPlanning';
import SuggestedVenues from './components/pages/AiPages/SuggestedVenues';
import ShoppingCart from './components/pages/ShoppingCart';
import FoodOptions from './components/pages/AiPages/FoodOptions';
import Attractions from './components/pages/AiPages/Attractions';
import Summary from './components/pages/Summary';
import Login from './components/pages/Login';
import UserProfile from './components/infoUser/UserProfile';
import FloatingChat from './components/chat/FloatingChat';
import { AuthContext } from './Context/AuthContext';
import { EventProvider } from './Context/EventContext';
import { BudgetProvider } from './Context/BudgetContext';
import styled from 'styled-components';
import Layout from './components/Layout';
import PreLoginPage from './components/pages/PreLoginPage';

const ShowProfileButton = styled.button`
    position: fixed;
    top: 1rem;
    left: 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 5px;
`;

const App = () => {
    const [cartItems, setCartItems] = useState([]);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // useEffect(() => {
    //     // בדיקה אם המשתמש לא מחובר והעברה ל-login
    //     if (!isAuthenticated) {
    //         navigate('/login');
    //     }
    // }, [isAuthenticated, navigate]);

    useEffect(() => {
        // טעינת פריטי עגלה מ-localStorage
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(savedCartItems);
    }, []);

    useEffect(() => {
        // שמירת עגלת הקניות ב-localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <EventProvider>
            <BudgetProvider>
                <Layout>
                    {/* בדיקת התחברות להצגת תוכן מותאם */}
                    {isAuthenticated ? (
                        <ShoppingCart cartItems={cartItems} />
                    ) : null}

                    <Routes>
                        {isAuthenticated ? (
                            <>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/plan-event" element={<EventPlanning />} />
                                <Route path="/suggested-venues" element={<SuggestedVenues />} />
                                <Route path="/food-options" element={<FoodOptions />} />
                                <Route path="/attractions" element={<Attractions />} />
                                <Route path="/summary" element={<Summary />} />
                                <Route path="/chat" element={<FloatingChat />} />
                                {/*<Route path="*" element={<Navigate to="/" replace />} /> /!* נתיב ברירת מחדל *!/*/}
                            </>
                        ) : (
                            <>
                                <Route path="/" element={<PreLoginPage />} />
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/login" element={<Login />} />
                                {/*<Route path="*" element={<Navigate to="/login" replace />} /> /!* נתיב ברירת מחדל *!/*/}
                            </>
                        )}
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </Layout>
            </BudgetProvider>
        </EventProvider>
    );
};

export default App;