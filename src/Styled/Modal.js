import React from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    width: 80%;
    max-width: 500px;
    text-align: center;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
`;

const Modal = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;

    return (
        <ModalBackground onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <h2>{content.name}</h2>
                <p>{content.description}</p>
                <p><strong>Estimated Price: ${content.price}</strong></p>
            </ModalContainer>
        </ModalBackground>
    );
};

export default Modal;
