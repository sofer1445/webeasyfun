import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BudgetContext } from '../../Context/BudgetContext';
import { UserContext } from '../../Context/UserContext';
import NavBarComponent from "./NavBarComponent";

const HomePageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f5f5f5;
`;

const HeaderSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
`;

const Logo = styled.h1`
    font-size: 3rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1rem;
`;

const Tagline = styled.p`
    font-size: 1.2rem;
    color: #666;
`;

const SearchSection = styled.div`
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 25px;
    padding: 0.5rem 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    font-size: 1rem;
    padding: 0.5rem;
    flex: 1;
`;

const SearchButton = styled.button`
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #555;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const HomePage = () => {
    const navigate = useNavigate();
    const budgetRef = useRef(null);
    const { setBudget } = useContext(BudgetContext);
    const { user } = useContext(UserContext);
    const [budget, setBudgetValue] = useState('');

    const handleStartPlanning = () => {
        const budget = parseFloat(budgetRef.current.value);
        setBudget(budget);
        navigate('/plan-event');
    };

    const isBudgetValid = budget && !isNaN(budget) && parseFloat(budget) > 0;

    return (
        <>
            <NavBarComponent />
            <HomePageContainer>
                <HeaderSection>
                    <Logo>Easy Fun</Logo>
                    <Tagline>Plan your perfect event with us</Tagline>
                </HeaderSection>
                <SearchSection>
                    <SearchInput
                        ref={budgetRef}
                        onChange={(e) => setBudgetValue(e.target.value)}
                        placeholder="Enter your budget..."
                        type="number"
                        min="0"
                        step="100"
                        required
                    />
                    <Link to="/plan-event" onClick={handleStartPlanning}>
                        <SearchButton disabled={!isBudgetValid}>Start Planning</SearchButton>
                    </Link>
                </SearchSection>
            </HomePageContainer>
        </>
    );
};

export default HomePage;
