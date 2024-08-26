import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const BackButton = styled.button`
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 5px;
    font-size: 1rem;
`;

const BackButtonComponent = () => {
    const navigate = useNavigate();
    return <BackButton onClick={() => navigate(-1)}>Back</BackButton>;
};

export default BackButtonComponent;