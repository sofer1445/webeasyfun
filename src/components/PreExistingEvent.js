import React from 'react';
import styled from 'styled-components';
import CardComponent from './CardComponent';

const EventContainer = styled.div`
    border: 1px solid #ccc;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
    background-color: #fff;
    z-index: 10; /* Ensure it is above other components */
`;

const EventDetails = styled.div`
    margin-bottom: 1rem;
`;

const Button = styled.button`
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 20px;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #555;
    }
`;

const PreExistingEvent = ({ event, onSelect, children }) => {
    console.log('Rendering PreExistingEvent with event:', event);



    return (
        <EventContainer>
            <h2>Similar Event Found</h2>
            <EventDetails>
                <p>{event.description}</p>
                <div>
                    {event.elementsOfEvent && event.elementsOfEvent.map((element, index) => (
                        <CardComponent
                            key={index}
                            item={{
                                name: element,
                                description: 'Description of ' + element,
                                price: event.budget
                            }}
                        />
                    ))}
                </div>
            </EventDetails>
            <Button onClick={() => onSelect(event)}>Select This Event</Button>
            {children}
        </EventContainer>
    );
};

export default PreExistingEvent;