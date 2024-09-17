import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styled, {keyframes} from 'styled-components';
import {EventContext} from '../../Context/EventContext';
import {BudgetContext} from '../../Context/BudgetContext';
import Spinner from "../../Styled/Spinner";
import CardComponent from '../CardComponent';
import chatHigh from '../../images/aiChat/chatHigh.webp';
import chatLow from '../../images/aiChat/chatLow.webp';
import chatMedium from '../../images/aiChat/chatMid.webp';

// Animation for spinner
const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const ChatContainer = styled.div`
    ${({$minimized}) => $minimized ? 'height: 50px;' : 'max-height: 50vh;'}; /* שינוי גובה אם ממוזער */
    position: fixed;
    bottom: 20px;
    left: 20px; /* מיקום שמאלי תחתון */
    width: 400px; /* רוחב הצ'אט */
    background-color: #f1f1f1;
    border-radius: 10px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    z-index: 1050; /* z-index גבוה יותר כדי למנוע חפיפות */
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease;
`;

const ChatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: #343a40;
    color: white;
    border-bottom: 1px solid #ddd;
    border-radius: 10px 10px 0 0;
    font-size: 18px;
    cursor: pointer; /* שינוי סמן ללחיצה */
`;

const ChatBody = styled.div`
    flex: 1;
    padding: 15px;
    overflow-y: auto; /* גלילה במקרה של הרבה הודעות */
    background-color: #ffffff;
    display: ${({$minimized}) => $minimized ? 'none' : 'block'}; /* הסתרת גוף הצ'אט במצב ממוזער */
`;

const Message = styled.div`
    margin-bottom: 15px;
    text-align: ${({$sender}) => ($sender === 'user' ? 'right' : 'left')};
    color: ${({$sender}) => ($sender === 'user' ? '#212529' : '#007bff')};
    background-color: ${({$sender}) => ($sender === 'user' ? '#e9ecef' : '#d4edda')};
    padding: 10px;
    border-radius: 12px;
    max-width: 80%;
    margin: ${({$sender}) => ($sender === 'user' ? '0 0 0 auto' : '0 auto 0 0')};
`;

const ChatFooter = styled.div`
    padding: 10px;
    border-top: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f8f9fa;
    gap: 8px; /* מרווח בין הכפתורים */
`;

const Input = styled.input`
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const SendButton = styled.button`
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }

    ${({disabled}) => disabled && 'opacity: 0.6; cursor: not-allowed;'}
`;

const RetryButton = styled.button`
    padding: 10px 15px;
    background-color: #ffc107;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #e0a800;
    }
`;

const FinishButton = styled.button`
    padding: 10px 15px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #218838;
    }
`;

const SuggestionsList = styled.div`
    position: fixed; /* שונה כדי למנוע מהכרטיסיות להיות צמודות לצ'אט */
    top: 100px; /* נותן מרווח מלמעלה */
    left: 50%; /* ממרכז את הכרטיסיות בעמוד */
    transform: translateX(-50%); /* ממרכז את הכרטיסיות */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* כרטיסיות עם פריסה רחבה יותר */
    grid-gap: 1.5rem;
    max-width: 1200px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1060; /* z-index גבוה כדי להציג מעל הצ'אט */
    margin-bottom: 20px;
`;


const FloatingChat = ({onClose}) => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [minimized, setMinimized] = useState(false); // משתנה למצבים ממוזערים
    const navigate = useNavigate();
    const {eventData} = useContext(EventContext);
    const {budget, cartItems, handleAddToCart} = useContext(BudgetContext);

    // פונקציה לסיום התכנון וניווט לעמוד הסיכום
    const handleFinishPlanning = () => {
        navigate('/summary'); // ניווט לעמוד הסיכום
    };

    // Initial message when chat starts
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
        setMessages([{text: initialMessage, sender: 'bot'}]);
        sendMessage(initialMessage, true);
    }, [eventData, budget, cartItems]);

    // Function to load suggestions from the server
    const sendMessage = async (message = userInput, isInitial = false, isRetry = false) => {
        if (typeof message !== 'string' || message.trim() === '') return;

        console.log('sendMessage called with:', { message, isInitial, isRetry });

        let newMessages = [...messages];
        if (!isRetry) {
            newMessages = [...newMessages, { text: `You: ${message}`, sender: 'user' }];
            setMessages(newMessages);
            if (!isInitial) setUserInput('');
        }
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
            console.log("Response from server: ", data);

            if (!isRetry) {
                setMessages(prevMessages => [...prevMessages, { text: data.split(' - ')[0], sender: 'bot' }]);
            }

            const parsedSuggestions = parseSuggestions(data);
            console.log("Parsed suggestions: ", parsedSuggestions);
            setSuggestions(parsedSuggestions);

        } catch (error) {
            console.error('Error:', error);
            if (!isRetry) {
                setMessages([...newMessages, { text: `Error contacting the server: ${error.message}`, sender: 'bot' }]);
            }
        } finally {
            setLoading(false);
        }
    };

    <RetryButton onClick={() => {
        console.log('RetryButton clicked');
        sendMessage(userInput, false, true);
    }}>Load New Suggestions</RetryButton>

    const parseSuggestions = (data) => {
        const suggestionLines = data.trim().split('\n').filter(line => line.match(/Estimated price/i));

        return suggestionLines.map((line, index) => {
            const nameMatch = line.match(/^\s*Option \d+:\s*([^-]+)\s*-/);

            if (!nameMatch) {
                console.error(`Invalid data format for suggestion: ${line}`);
                return null;
            }

            const name = nameMatch[1].trim();
            const description = line.replace(nameMatch[0], '').trim();
            const priceMatch = line.match(/Estimated price:\s*\$?(\d+)/i);
            const price = priceMatch ? parseInt(priceMatch[1], 10) : 0;
            let image = {
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
        setMessages([...messages, {text: `You added: ${suggestion.name}`, sender: 'user'}]);
        setSuggestions([]);
    };

    // Send message on Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    // Toggle minimize chat
    const toggleMinimize = () => {
        setMinimized(!minimized);
    };

    return (
        <>
            <ChatContainer $minimized={minimized}>
                <ChatHeader onClick={toggleMinimize}> {/* שינוי - לחיצה על הכותרת למזעור/החזרה */}
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
                        <SendButton onClick={sendMessage} disabled={loading}>Send</SendButton>
                        {loading && <Spinner/>} {/* ספינר בזמן טעינה */}
                        <RetryButton onClick={() => {
                            console.log('RetryButton clicked');
                            sendMessage(userInput, false, true);
                        }}>Load New Suggestions</RetryButton>
                        <FinishButton onClick={handleFinishPlanning}>Finish
                        Planning</FinishButton>
                    </ChatFooter>
                )}
            </ChatContainer>

            {suggestions.length > 0 && (
                <SuggestionsList>
                    {suggestions.map((suggestion) => (
                        <CardComponent
                            key={suggestion.id}
                            item={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                        />
                    ))}
                </SuggestionsList>
            )}
        </>
    );
};

export default FloatingChat;
