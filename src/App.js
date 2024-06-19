import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignUp from './components/SignUp';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import EventPlanning from './components/EventPlanning';
import SuggestedVenues from './components/SuggestedVenues';
import ShoppingCart from './components/ShoppingCart';
import FoodOptions from './components/FoodOptions'; // Import the FoodOptions component

const App = () => {
    const [cartItems, setCartItems] = useState([]);

    const handleAddToCart = (item) => {
        setCartItems([...cartItems, item]);
    };

    return (
        <Router>
            <ShoppingCart cartItems={cartItems} /> {/* Remove handleAddToCart from props */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/plan-event" element={<EventPlanning />} />
                <Route path="/suggested-venues" element={<SuggestedVenues addToCart={handleAddToCart} />} />
                <Route path="/food-options" element={<FoodOptions addToCart={handleAddToCart} />} /> {/* Add the FoodOptions route */}
            </Routes>
        </Router>
    );
};

export default App;