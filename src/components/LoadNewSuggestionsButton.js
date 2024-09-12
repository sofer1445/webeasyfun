// src/components/LoadNewSuggestionsButton.js
import React from 'react';
import styled from 'styled-components';
import Spinner from '../Styled/Spinner';

const Button = styled.button`
    margin-top: 1rem;
    padding: 10px 15px;
    background-color: #4c68af;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #3b529a;
    }
`;

const LoadNewSuggestionsButton = ({ onClick, loading }) => {
    return (
        <Button onClick={onClick} disabled={loading}>
            {loading ? <Spinner /> : 'Load New Suggestions'}
        </Button>
    );
};

export default LoadNewSuggestionsButton;