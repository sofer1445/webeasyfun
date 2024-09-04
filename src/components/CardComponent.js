import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Styled/Modal';

const Card = styled.div`
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    text-align: center;
    border: none;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
`;

const Image = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 1rem;
`;

const Name = styled.h3`
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.5rem;
`;

const Price = styled.p`
    font-size: 1.2rem;
    color: #666;
`;

const ViewMoreButton = styled.button`
    margin-top: 1rem;
    padding: 10px 15px;
    background-color: #4c68af;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const CardComponent = ({ item, onClick }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewMoreClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <Card onClick={onClick}>
                <Image src={item.imageUrl} alt={item.name} />
                <Name>{item.name}</Name>
                <Price>Starting from ${item.price}</Price>
                <ViewMoreButton onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    handleViewMoreClick();
                }}>
                    View More
                </ViewMoreButton>
            </Card>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                content={{ name: item.name, description: item.description, price: item.price }}
            />
        </>
    );
};

export default CardComponent;
