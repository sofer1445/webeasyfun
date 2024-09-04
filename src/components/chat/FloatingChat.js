import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { EventContext } from '../../Context/EventContext';
import { BudgetContext } from '../../Context/BudgetContext';
import Spinner from "../../Styled/Spinner";

// Animation for spinner
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const ChatContainer = styled.div`
    position: fixed;
    bottom: 20px;
    left: 50%; /* משנים מ-right ל-left */
    transform: translateX(-50%); /* מוסיפים שורת קוד זו כדי להזיז את הצ'אט למרכז */
    width: 360px; /* צמצום רוחב הצ'אט לשמירה על נוחות */
    max-height: 80vh; /* שמירה על גובה מקסימלי של 80% מגובה החלון */
    background-color: #f8f9fa;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;
// שמירה על נראות טובה בכותרת הצ'אט
const ChatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background-color: #343a40;
    color: white;
    border-bottom: 1px solid #ddd;
    border-radius: 8px 8px 0 0;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    &:hover {
        color: #adb5bd;
    }
`;

const ChatBody = styled.div`
    flex: 1;
    padding: 10px; /* מרווח גדול יותר לתוכן */
    overflow-y: auto;
    background-color: #ffffff;
    max-height: 60vh; /* גובה מקסימלי לגוף הצ'אט */
`;

// סגנון ההודעה לשיפור הפרדה בין המשתמש ל-AI
const Message = styled.div`
    margin-bottom: 10px;
    text-align: ${({ sender }) => (sender === 'user' ? 'right' : 'left')};
    color: ${({ sender }) => (sender === 'user' ? '#212529' : '#007bff')};
    background-color: ${({ sender }) => (sender === 'user' ? '#e9ecef' : '#d4edda')};
    padding: 8px;
    border-radius: 10px;
    max-width: 80%;
    margin: ${({ sender }) => (sender === 'user' ? '0 0 0 auto' : '0 auto 0 0')}; /* יישור לפי צד ההודעה */
`;

// עיצוב תחתית הצ'אט לנגישות ולנוחות
const ChatFooter = styled.div`
    padding: 10px; /* מרווח גדול יותר */
    border-top: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f8f9fa;
`;

// שיפור עיצוב שדה הקלט לנוחות משתמש
const Input = styled.input`
    flex: 1;
    padding: 8px; /* ריווח גדול יותר לנוחות */
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 8px;
`;

// שיפור עיצוב כפתור השליחה לנגישות ולנראות
const SendButton = styled.button`
    padding: 8px 12px; /* ריווח גדול יותר לנוחות */
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
    ${({ disabled }) => disabled && 'opacity: 0.6; cursor: not-allowed;'}
`;

// שיפור עיצוב כפתור סיום התכנון לנגישות ולנראות
const FinishButton = styled.button`
    padding: 8px 12px; /* ריווח גדול יותר לנוחות */
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #218838;
    }
`;

// שיפור תצוגת הכפתורים להוספת הצעות
const SuggestionButton = styled.button`
    padding: 6px 12px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 5px;
    margin-right: 5px;
    &:hover {
        background-color: #5a6268;
    }
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
        const regex = /(\d+)\.\s(.+?)\s-\s(.+?)\s-\sEstimated Price:\s\$(\d+)/gi;
        let match;
        while ((match = regex.exec(data)) !== null) {
            const name = match[2].trim();
            const description = match[3].trim();
            const price = parseInt(match[4], 10);
            suggestions.push({ name: `${name} - ${description}`, price });
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
                        {msg.suggestions && msg.suggestions.length > 0 && (
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
