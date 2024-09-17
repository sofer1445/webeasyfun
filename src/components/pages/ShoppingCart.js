import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { BudgetContext } from '../../Context/BudgetContext';
import ShoppingCartIcon from '../../images/ShoppingCartIcon.jpeg';

const ShoppingCartContainer = styled.div`
    position: fixed;
    top: 60px;
    right: ${props => props.$showCart ? '0' : '-250px'};
    width: 250px;
    height: calc(100vh - 60px);
    background-color: #f5f5f5;
    padding: 2rem;
    box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    transition: right 0.3s ease;
`;

const CartIcon = styled.img`
    width: 50px;
    height: 50px;
    cursor: pointer;
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
`;

const CloseButton = styled.button`
    background-color: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    position: absolute;
    top: 1rem;
    right: 1rem;
`;

const Heading = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 2rem;
`;

const CartItemsContainer = styled.div`
    overflow-y: auto;
    max-height: calc(100vh - 200px);
`;

const CartItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

const ItemName = styled.p`
    font-size: 1.2rem;
    color: #333;
`;

const ItemPrice = styled.p`
    font-size: 1.2rem;
    color: #666;
`;

const RemoveButton = styled.button`
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 5px;
`;

const RemainingBudget = styled.p`
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-top: 2rem;
`;

const ShoppingCart = () => {
    const { budget, cartItems, handleRemoveFromCart, setCartItems } = useContext(BudgetContext);
    const [showCart, setShowCart] = useState(false);

    // Load cart items from localStorage when the component mounts
    useEffect(() => {
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(savedCartItems);
    }, [setCartItems]);

    // Save cart items to localStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleCartClick = () => {
        setShowCart(!showCart);
    };

    return (
        <>
            <CartIcon src={ShoppingCartIcon} alt="Shopping Cart" onClick={handleCartClick} />
            <ShoppingCartContainer $showCart={showCart}>
                <CloseButton onClick={handleCartClick}>&times;</CloseButton>
                <Heading>Your Cart</Heading>
                <p>Remaining Budget: ${budget}</p>
                {budget < 0 && <p style={{ color: 'red' }}>You have exceeded your budget!</p>}
                <CartItemsContainer>
                    {cartItems.map((item) => (
                        <CartItem key={item.id}>
                            <ItemName>{item.name}</ItemName>
                            <ItemPrice>${item.price}</ItemPrice>
                            <RemoveButton onClick={() => handleRemoveFromCart(item)}>Remove</RemoveButton>
                        </CartItem>
                    ))}
                </CartItemsContainer>
                <RemainingBudget>Remaining Budget: ${budget}</RemainingBudget>
            </ShoppingCartContainer>
        </>
    );
};

export default ShoppingCart;