// src/components/chat/FloatingChat.js
import React, { useState } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
    position: fixed;
    bottom: 100px;
    right: 20px;
    width: ${({ minimized }) => (minimized ? '50px' : '300px')};
    height: ${({ minimized }) => (minimized ? '50px' : '400px')};
    background-color: white;
    border: 2px solid #333;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 1001;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const ChatBody = styled.div`
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    display: ${({ minimized }) => (minimized ? 'none' : 'block')};
`;

const ChatFooter = styled.div`
    padding: 10px;
    border-top: 1px solid #ddd;
    display: ${({ minimized }) => (minimized ? 'none' : 'flex')};
    align-items: center;
`;

const IntroMessage = styled.div`
    background-color: #e0e0e0;
    color: #333;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    text-align: center;
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
`;

const FloatingChat = ({ onClose, minimized }) => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    const sendMessage = async () => {
        if (userInput.trim() === '') return;

        const newMessages = [...messages, { text: `You: ${userInput}`, sender: 'user' }];
        setMessages(newMessages);

        try {
            const response = await fetch(`http://localhost:9125/chat?message=${encodeURIComponent(userInput)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            setMessages([...newMessages, { text: `AI: ${data}`, sender: 'bot' }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages([...newMessages, { text: `Error contacting the server: ${error.message}`, sender: 'bot' }]);
        }

        setUserInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <ChatContainer minimized={minimized}>
            <ChatBody minimized={minimized}>
                <IntroMessage>ברוכים הבאים לצ'אט עם עוזרת בינה מלאכותית!</IntroMessage>
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                        {msg.text}
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
                />
                <SendButton onClick={sendMessage}>Send</SendButton>
            </ChatFooter>
        </ChatContainer>
    );
};

export default FloatingChat;