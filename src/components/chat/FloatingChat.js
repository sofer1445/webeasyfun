// src/components/chat/FloatingChat.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { EventContext } from '../../Context/EventContext';
import { BudgetContext } from '../../Context/BudgetContext';

const ChatContainer = styled.div`
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    border: 2px solid #333;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 1001;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const ChatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #4c68af;
    color: white;
    border-bottom: 1px solid #ddd;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
`;

const ChatBody = styled.div`
    flex: 1;
    padding: 10px;
    overflow-y: auto;
`;

const ChatFooter = styled.div`
    padding: 10px;
    border-top: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Input = styled.input`
    flex: 1;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 5px;
`;

const SendButton = styled.button`
    padding: 5px 10px;
    background-color: #4c68af;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    ${({ disabled }) => disabled && 'opacity: 0.5; cursor: not-allowed;'}
`;

const FinishButton = styled.button`
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const Message = styled.div`
    margin-bottom: 10px;
    text-align: ${({ sender }) => (sender === 'user' ? 'right' : 'left')};
    color: ${({ sender }) => (sender === 'user' ? '#888' : '#4c68af')};
`;

const SuggestionButton = styled.button`
    padding: 5px 10px;
    background-color: #4c68af;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 5px;
    margin-right: 5px;
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: ${spin} 2s linear infinite;
    margin-left: 10px;
`;

const FloatingChat = ({ onClose, minimized }) => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { eventData } = useContext(EventContext);
    const { budget, cartItems, handleAddToCart } = useContext(BudgetContext);

    useEffect(() => {
        const initialMessage = `
            Event Summary:
            Date: ${eventData.eventDate}
            Guests: ${eventData.guests}
            Budget: ${eventData.budget}
            Remaining Budget: ${budget}
            Selected Items: ${cartItems.map(item => item.name).join(', ')}

            ${budget > 0 ? 'Would you like to add more items?' : 'You have exceeded your budget. Would you like to change any items?'}
        `;
        setMessages([{ text: initialMessage, sender: 'bot' }]);
        sendMessage(initialMessage, true);
    }, [eventData, budget, cartItems]);

    const sendMessage = async (message = userInput, isInitial = false) => {
        message = String(message);

        if (message.trim() === '') return;

        const newMessages = [...messages, { text: `You: ${message}`, sender: 'user' }];
        setMessages(newMessages);
        if (!isInitial) setUserInput('');
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:9125/chat?message=${encodeURIComponent(message)}&eventDate=${encodeURIComponent(eventData.eventDate)}&guestCount=${encodeURIComponent(eventData.guests)}&totalBudget=${encodeURIComponent(eventData.budget)}&remainingBudget=${encodeURIComponent(budget)}&selectedItems=${encodeURIComponent(cartItems.map(item => item.name).join(', '))}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            const suggestions = parseSuggestions(data);

            // Check if suggestions are parsed correctly
            console.log("Parsed Suggestions: ", suggestions);

            setMessages([...newMessages, { text: `AI: ${data}`, sender: 'bot', suggestions }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages([...newMessages, { text: `Error contacting the server: ${error.message}`, sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };


    const parseSuggestions = (data) => {
        const suggestions = [];
        // Updated regex to match the formatted response
        const regex = /Option\s\d+:\s(.+?)\s-\s(.+?),\sEstimated Price:\s\$(\d+)/g;
        let match;
        while ((match = regex.exec(data)) !== null) {
            const name = match[1].trim(); // Option name
            const vendor = match[2].trim(); // Vendor name
            const price = parseInt(match[3], 10); // Price as integer
            suggestions.push({ name: `${name} - ${vendor}`, price }); // Button label includes both option and vendor
        }
        return suggestions;
    };




    const handleSuggestionClick = (suggestion) => {
        handleAddToCart(suggestion);
        setMessages([...messages, { text: `You added: ${suggestion.name} - $${suggestion.price}`, sender: 'user' }]);
        sendMessage(`You selected: ${suggestion.name}`, true);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const handleFinishPlanning = () => {
        navigate('/summary');
    };

    return (
        <ChatContainer minimized={minimized}>
            <ChatHeader>
                <span>Chat</span>
                <CloseButton onClick={onClose}>X</CloseButton>
            </ChatHeader>
            <ChatBody minimized={minimized}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <Message sender={msg.sender}>{msg.text}</Message>
                        {msg.suggestions && (
                            <div>
                                {msg.suggestions.map((suggestion, i) => (
                                    <SuggestionButton key={i} onClick={() => handleSuggestionClick(suggestion)}>
                                        {suggestion.name} - ${suggestion.price}
                                    </SuggestionButton>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </ChatBody>
            <ChatFooter minimized={minimized}>
                <Input
                    type="text"
                    placeholder="Type a message..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <SendButton onClick={sendMessage} disabled={loading}>Send</SendButton>
                {loading && <Spinner />}
                <FinishButton onClick={handleFinishPlanning}>Finish Planning</FinishButton>
            </ChatFooter>
        </ChatContainer>
    );
};

export default FloatingChat;
