import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { EventContext } from '../../Context/EventContext';
import { BudgetContext } from '../../Context/BudgetContext';
import Spinner from "../../Styled/Spinner";
import CardComponent from '../CardComponent';
import chatHigh from '../../images/aiChat/chatHigh.webp';
import chatLow from '../../images/aiChat/chatLow.webp';
import chatMedium from '../../images/aiChat/chatMid.webp';

// עיצוב הצ'אט והכפתורים
const ChatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #333;
    color: #fff;
    border-bottom: 1px solid #555;
    border-radius: 12px 12px 0 0;
    font-size: 18px;
    cursor: pointer;
`;

const Message = styled.div`
    margin-bottom: 15px;
    text-align: ${({$sender}) => ($sender === 'user' ? 'right' : 'left')};
    color: ${({$sender}) => ($sender === 'user' ? '#e9ecef' : '#007bff')};
    background-color: ${({$sender}) => ($sender === 'user' ? '#444' : '#343a40')};
    padding: 12px;
    border-radius: 12px;
    max-width: 80%;
    margin: ${({$sender}) => ($sender === 'user' ? '0 0 0 auto' : '0 auto 0 0')};
`;

const ChatContainer = styled.div`
    ${({ $minimized }) => $minimized ? 'height: 50px;' : 'max-height: 70vh;'};
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 450px;
    background-color: #1e1e1e;
    border-radius: 10px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    z-index: 1050;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease;
`;

const ChatBody = styled.div`
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    background-color: #2b2b2b;
    display: ${({ $minimized }) => $minimized ? 'none' : 'block'};
    max-height: calc(100% - 100px);
`;

const ChatFooter = styled.div`
    padding: 10px;
    border-top: 1px solid #555;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #1e1e1e;
    gap: 8px;
    min-height: 60px;
`;

const Input = styled.input`
    flex: 1;
    padding: 12px;
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 8px;
    outline: none;
    ::placeholder {
        color: #888;
    }
`;

const RetryButton = styled.button`
    padding: 10px 16px;
    background-color: #f0ad4e;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
        background-color: #ec971f;
    }
`;

const FinishButton = styled.button`
    padding: 10px 16px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
        background-color: #218838;
    }
`;

const SuggestionsList = styled.div`
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: 1.5rem;
    max-width: 1200px;
    padding: 20px;
    background-color: #2e2e2e;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1060;
    margin-bottom: 20px;
`;

const FloatingChat = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [minimized, setMinimized] = useState(false);
    const [lastMessage, setLastMessage] = useState(''); // הוספת lastMessage ב-state
    const [hasFetchedSuggestions, setHasFetchedSuggestions] = useState(false); // משתנה חדש למניעת קריאות כפולות
    const [hasCardComponent, setHasCardComponent] = useState(false); // משתנה חדש לבדיקת הצגת CardComponent
    const navigate = useNavigate();
    const { eventData } = useContext(EventContext);
    const { budget, cartItems, handleAddToCart } = useContext(BudgetContext);

    const handleFinishPlanning = () => {
        navigate('/summary');
    };

    useEffect(() => {
        const initialMessage = `
            Event Summary:
            Date: ${eventData.eventDate}
            Guests: ${eventData.guests}
            Budget: ${eventData.budget}
            Remaining Budget: ${budget}
            Selected Items: ${cartItems.map(item => item.name).join(', ')}

            ${budget > 0 ? `I see you have a remaining budget of $${budget}. Let me show you some additional options to make your event truly exceptional!` : 'You’ve exceeded your budget. Would you like to review and adjust your selections?'}
            `;
        setMessages([{ text: initialMessage, sender: 'bot' }]);
        sendMessage(initialMessage, true);
    }, [eventData, budget, cartItems]);

    const fetchWithTimeout = (url, options, timeout = 10000) => {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))
        ]);
    };

    const sendMessage = async (message = userInput, isInitial = false, isRetry = false) => {
        console.log('sendMessage called with:', { message, isInitial, isRetry });

        if (isRetry) {
            message = lastMessage; // Use last message when retrying
        } else {
            setLastMessage(message); // Store the last message
        }

        if (typeof message !== 'string' || message.trim() === '') return;

        let newMessages = [...messages];
        if (!isRetry) {
            newMessages = [...newMessages, { text: `You: ${message}`, sender: 'user' }];
            setMessages(newMessages);
            if (!isInitial) setUserInput('');
        }
        setLoading(true);

        try {
            const response = await fetchWithTimeout(
                `http://localhost:9125/chat?message=${encodeURIComponent(message)}&eventDate=${encodeURIComponent(eventData.eventDate)}&guestCount=${encodeURIComponent(eventData.guests)}&totalBudget=${encodeURIComponent(eventData.budget)}&remainingBudget=${encodeURIComponent(budget)}&selectedItems=${encodeURIComponent(cartItems.map(item => item.name).join(', '))}&location=${encodeURIComponent(eventData.location)}`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' } },
                15000
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            if (!isRetry) {
                setMessages(prevMessages => [...prevMessages, { text: data.split(' - ')[0], sender: 'bot' }]);
            }

            const parsedSuggestions = parseSuggestions(data);
            setSuggestions(parsedSuggestions);
            setHasCardComponent(parsedSuggestions.length > 0); // עדכון המשתנה בהתאם לתוצאות

        } catch (error) {
            if (!isRetry) {
                setMessages([...newMessages, { text: `Error contacting the server: ${error.message}`, sender: 'bot' }]);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchAdditionalSuggestions = async () => {
        if (hasFetchedSuggestions || loading) return;

        console.log("Fetching additional suggestions from DB...");
        setLoading(true);

        try {
            const response = await fetchWithTimeout(
                `http://localhost:9125/get-three-event-additions?remainingBudget=${budget}&location=${encodeURIComponent(eventData.location)}`,
                { method: 'GET' },
                15000
            );
            console.log("Response from server:", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();
            const parsedSuggestions = parseSuggestions(data);
            setSuggestions(parsedSuggestions);
            setHasFetchedSuggestions(true);
            setHasCardComponent(parsedSuggestions.length > 0); // עדכון המשתנה בהתאם לתוצאות
        } catch (error) {
            console.error('Error fetching additional suggestions:', error);
            setSuggestions([]);
            setHasCardComponent(false); // עדכון המשתנה בהתאם לתוצאות
        } finally {
            setLoading(false);
        }
    };

    const parseSuggestions = (data) => {
        const suggestionLines = data.trim().split('\n').filter(line => line.match(/Estimated Price/i));

        return suggestionLines.map((line, index) => {
            // נשתמש ב-regex שיטפל בשמות עם גרשיים או תיאורים מיוחדים
            const nameMatch = line.match(/^\s*Option \d+:\s*([^']+?)\s*-\s*['"]?([^'"]+)?['"]?,?\s*Estimated Price:\s*\$(\d+)/i);

            if (!nameMatch) {
                console.error(`Invalid data format for suggestion line: ${line}`);
                return null;
            }

            const name = nameMatch[1].trim();
            const description = nameMatch[2] ? nameMatch[2].trim() : ''; // ייתכן ואין תיאור
            const price = parseInt(nameMatch[3], 10);

            const image = {
                high: chatHigh,
                medium: chatMedium,
                low: chatLow
            }[price > budget * 0.25 ? 'high' : price > budget * 0.15 ? 'medium' : 'low'];

            return {
                id: index + 1,
                name,
                description,
                price,
                image
            };
        }).filter(item => item !== null);
    };


    const handleSuggestionClick = (suggestion) => {
        handleAddToCart(suggestion);
        setMessages([...messages, { text: `You added: ${suggestion.name}`, sender: 'user' }]);
        setSuggestions([]);
        setHasCardComponent(false); // עדכון המשתנה בהתאם לתוצאות
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const toggleMinimize = () => {
        setMinimized(!minimized);
    };

    useEffect(() => {
        if (!loading && suggestions.length === 0) {
            fetchAdditionalSuggestions();
        }
    }, [loading, suggestions]);

    return (
        <>
            <ChatContainer $minimized={minimized}>
                <ChatHeader onClick={toggleMinimize}>
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
                {!minimized && (
                    <ChatFooter>
                        <Input
                            type="text"
                            placeholder="Type a message..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />
                        {loading && <Spinner />}
                        <RetryButton onClick={() => sendMessage(userInput, false, true)}>Load New Suggestions</RetryButton>
                        <FinishButton onClick={handleFinishPlanning}>Finish Planning</FinishButton>
                    </ChatFooter>
                )}
            </ChatContainer>

            {hasCardComponent ? (
                <SuggestionsList>
                    {suggestions.map((suggestion) => (
                        <CardComponent
                            key={suggestion.id}
                            item={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                        />
                    ))}
                </SuggestionsList>
            ) : (
                <div>No suggestions available</div>
            )}
        </>
    );
};

export default FloatingChat;