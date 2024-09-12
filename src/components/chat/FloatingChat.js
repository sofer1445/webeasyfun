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
    ${({ $minimized }) => $minimized && 'display: none;'}
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 460px;
    max-height: 80vh;
    background-color: #f8f9fa;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

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
    padding: 10px;
    overflow-y: auto;
    background-color: #ffffff;
    max-height: 60vh;
`;

const Message = styled.div`
    margin-bottom: 10px;
    text-align: ${({ $sender }) => ($sender === 'user' ? 'right' : 'left')};
    color: ${({ $sender }) => ($sender === 'user' ? '#212529' : '#007bff')};
    background-color: ${({ $sender }) => ($sender === 'user' ? '#e9ecef' : '#d4edda')};
    padding: 8px;
    border-radius: 10px;
    max-width: 80%;
    margin: ${({ $sender }) => ($sender === 'user' ? '0 0 0 auto' : '0 auto 0 0')};
`;

const ChatFooter = styled.div`
    padding: 10px;
    border-top: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f8f9fa;
`;

const Input = styled.input`
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 8px;
`;

const SendButton = styled.button`
    padding: 8px 12px;
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

const FinishButton = styled.button`
    padding: 8px 12px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #218838;
    }
`;

const SuggestionButton = styled.button`
    padding: 6px 12px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 5px 0;
    width: 100%;
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

    // Initial message when chat starts
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

            const data = await response.text();  // מקבל את התשובה כטקסט ולא JSON
            console.log("Response from server: ", data);  // הדפסת התשובה המלאה מהשרת לקונסול

            setTimeout(() => {
                setMessages([...newMessages, { text: `AI: ${data}`, sender: 'bot' }]);
            }, 500);

        } catch (error) {
            console.error('Error:', error);
            setMessages([...newMessages, { text: `Error contacting the server: ${error.message}`, sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    // Send message on Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    // Finish planning and navigate to the summary page
    const handleFinishPlanning = () => {
        navigate('/summary');
    };

    return (
        <ChatContainer $minimized={minimized}>
            <ChatHeader>
                <span>Chat</span>
                <button onClick={onClose}>X</button>
            </ChatHeader>
            <ChatBody $minimized={minimized}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <Message $sender={msg.sender}>{msg.text}</Message>
                    </div>
                ))}
            </ChatBody>
            <ChatFooter $minimized={minimized}>
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
                <button onClick={handleFinishPlanning}>Finish Planning</button>
            </ChatFooter>
        </ChatContainer>
    );
};

export default FloatingChat;