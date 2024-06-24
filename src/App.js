import React, { useState } from 'react';
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

const App = () => {
    const [cartItems, setCartItems] = useState([]);

    const handleAddToCart = (item) => {
        setCartItems([...cartItems, item]);
    };

    return (
        <Router>
            <UserProfile />
            <ShoppingCart cartItems={cartItems} /> {/* Remove handleAddToCart from props */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/plan-event" element={<EventPlanning />} />
                <Route path="/suggested-venues" element={<SuggestedVenues addToCart={handleAddToCart} />} />
                <Route path="/food-options" element={<FoodOptions addToCart={handleAddToCart} />} />
                <Route path="/attractions" element={<Attractions addToCart={handleAddToCart} />} />
                <Route path="/summary" element={<Summary cartItems={cartItems} />} />
            </Routes>
        </Router>
    );
};

export default App;