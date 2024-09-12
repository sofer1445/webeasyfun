import React, {useContext, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import SignUp from './components/pages/SignUp';
import AboutUs from './components/pages/AboutUs';
import Contact from './components/pages/Contact';
import EventPlanning from './components/pages/EventPlanning';
import SuggestedVenues from './components/pages/SuggestedVenues';
import ShoppingCart from './components/pages/ShoppingCart';
import FoodOptions from './components/pages/FoodOptions';
import Attractions from './components/pages/Attractions';
import Summary from "./components/pages/Summary";
import Login from "./components/pages/Login";
import UserProfile from "./components/infoUser/UserProfile";
import FloatingChat from "./components/chat/FloatingChat";
import {UserContext} from './Context/UserContext';
import {EventProvider} from './Context/EventContext';
import styled, {keyframes} from 'styled-components';
import LogoImgRooster from './images/logo/LogoImgRooster.jpeg';
import Layout from './components/Layout';

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
    width: 100px;
    height: auto;
    cursor: pointer;
    border: 2px solid #333;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    animation: ${pulse} 5s infinite;
    z-index: 1000;

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
    const [remainingBudget, setRemainingBudget] = useState(0);
    const {user} = useContext(UserContext);

    const handleAddToCart = (item) => {
        setCartItems([...cartItems, item]);
        setRemainingBudget((prevBudget) => prevBudget - item.price);
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
        if (user) {
            setShowChat(!showChat);
            setMinimized(false);
        } else {
            alert('Please log in to use the chat.');
        }
    };

    const handleCloseChat = () => {
        setShowChat(false);
        setMinimized(false);
    };

    const handleOpenChat = (cartItems, remainingBudget, userName) => {
        setShowChat(true);
        setMinimized(false);
    };

    return (
        <EventProvider>
            <Router>
                <Layout>
                    {user && showUserProfile && <UserProfile onClose={handleCloseUserProfile}/>}
                    {!showUserProfile &&
                        <ShowProfileButton onClick={handleShowUserProfile}>Show Profile</ShowProfileButton>}
                    <ShoppingCart cartItems={cartItems} onOpenChat={handleOpenChat}/>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/signup" element={<SignUp/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/about" element={<AboutUs/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/plan-event" element={showEventPlanning ? <EventPlanning/> : null}/>
                        <Route path="/suggested-venues" element={<SuggestedVenues addToCart={handleAddToCart}/>}/>
                        <Route path="/food-options" element={<FoodOptions addToCart={handleAddToCart}/>}/>
                        <Route path="/attractions" element={<Attractions addToCart={handleAddToCart}/>}/>
                        <Route path="/chat" element={<FloatingChat onClose={handleCloseChat} minimized={minimized}/>}/>
                        <Route path="/summary" element={<Summary cartItems={cartItems}/>}/>
                    </Routes>
                    {/*<Logo src={LogoImgRooster} alt="Logo" onClick={handleLogoClick}/>*/}
                </Layout>
            </Router>
        </EventProvider>
    );
};

export default App;
