import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { BudgetContext } from '../../Context/BudgetContext';
import ShoppingCartIcon from '../../images/ShoppingCartIcon.jpeg';

const ShoppingCartContainer = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 200px;
    height: 100vh;
    background-color: #f5f5f5;
    padding: 2rem;
    box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
    z-index: 1;
`;

const CartIcon = styled.img`
    width: 50px;
    height: 50px;
    animation: ${props => props.$cartItems.length > 0 && !props.$showCart ? 'blink 1s linear infinite' : 'none'};
    @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 1; }
    }
`;

const Heading = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 2rem;
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
    const { budget, cartItems, handleRemoveFromCart } = useContext(BudgetContext);
    const [showCart, setShowCart] = useState(false);

    const handleCartClick = () => {
        setShowCart(!showCart);
    };

    return (
        <ShoppingCartContainer>
            <CartIcon src={ShoppingCartIcon} alt="Shopping Cart" onClick={handleCartClick} $cartItems={cartItems} $showCart={showCart} />
            {showCart && (
                <>
                    <Heading>Your Cart</Heading>
                    <p>Remaining Budget: ${budget}</p> {budget < 0 && <p style={{ color: 'red' }}>You have exceeded your budget!</p>}
                    {cartItems.map((item) => (
                        <CartItem key={item.id}>
                            <ItemName>{item.name}</ItemName>
                            <ItemPrice>${item.price}</ItemPrice>
                            <RemoveButton onClick={() => handleRemoveFromCart(item)}>Remove</RemoveButton>
                        </CartItem>
                    ))}
                    <RemainingBudget>Remaining Budget: ${budget}</RemainingBudget>
                </>
            )}
        </ShoppingCartContainer>
    );
};

export default ShoppingCart;