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
import { UserContext } from './Context/UserContext';
import styled from 'styled-components';

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
    const [showUserProfile, setShowUserProfile] = useState(true);
    const [showEventPlanning, setShowEventPlanning] = useState(true);
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

    return (
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
        </Router>
    );
};

export default App;