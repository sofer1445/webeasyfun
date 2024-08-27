// src/App.js
import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignUp from './components/SignUp';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import EventPlanning from './components/EventPlanning';
import SuggestedVenues from './components/SuggestedVenues';
import ShoppingCart from './components/ShoppingCart';
import FoodOptions from './components/FoodOptions';
import Attractions from './components/Attractions';
import Summary from "./components/Summary";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import FloatingChat from "./components/chat/FloatingChat";
import { UserContext } from './Context/UserContext';
import { EventProvider } from './Context/EventContext';
import styled, { keyframes } from 'styled-components';
import LogoImgRooster from './images/logo/LogoImgRooster.jpeg';

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

const pulse = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
`;

const Logo = styled.img`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 100px; /* Adjust size as needed */
    height: auto;
    cursor: pointer;
    border: 2px solid #333;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    animation: ${pulse} 5s infinite; /* Increased duration to 5 seconds */
    z-index: 1000; /* Ensure the logo appears above other components */

    &:hover {
        transform: scale(1.1);
    }
`;

const App = () => {
    const [cartItems, setCartItems] = useState([]);
    const [showUserProfile, setShowUserProfile] = useState(true);
    const [showEventPlanning, setShowEventPlanning] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const { user } = useContext(UserContext);

    const handleAddToCart = (item) => {
        setCartItems([...cartItems, item]);
    };

    const handleCloseUserProfile = () => {
        setShowUserProfile(false);
        setShowEventPlanning(true);
    };

    const handleShowUserProfile = () => {
        setShowUserProfile(true);
        setShowEventPlanning(false);
    };

    const handleLogoClick = () => {
        if (showChat) {
            setShowChat(false);
        } else {
            setShowChat(true);
            setMinimized(false);
        }
    };

    const handleCloseChat = () => {
        setShowChat(false);
        setMinimized(false);
    };

    return (
        <EventProvider>
            <Router>
                {user && showUserProfile && <UserProfile onClose={handleCloseUserProfile} />}
                {!showUserProfile && <ShowProfileButton onClick={handleShowUserProfile}>Show Profile</ShowProfileButton>}
                <ShoppingCart cartItems={cartItems} />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/plan-event" element={showEventPlanning ? <EventPlanning /> : null} />
                    <Route path="/suggested-venues" element={<SuggestedVenues addToCart={handleAddToCart} />} />
                    <Route path="/food-options" element={<FoodOptions addToCart={handleAddToCart} />} />
                    <Route path="/attractions" element={<Attractions addToCart={handleAddToCart} />} />
                    <Route path="/summary" element={<Summary cartItems={cartItems} />} />
                </Routes>
                <Logo src={LogoImgRooster} alt="Logo" onClick={handleLogoClick} />
                {showChat && <FloatingChat onClose={handleCloseChat} minimized={minimized} />}
            </Router>
        </EventProvider>
    );
};

export default App;