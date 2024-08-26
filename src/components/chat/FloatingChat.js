import React from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
    position: fixed;
    bottom: 100px;
    right: 20px;
    width: 300px;
    height: 400px;
    background-color: white;
    border: 2px solid #333;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 1001;
    display: flex;
    flex-direction: column;
`;

const ChatHeader = styled.div`
    background-color: #4c68af;
    color: white;
    padding: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    text-align: center;
`;

const ChatBody = styled.div`
    flex: 1;
    padding: 10px;
    overflow-y: auto;
`;

const IntroMessage = styled.div`
    background-color: #e0e0e0;
    color: #333;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    text-align: center;
`;

const ChatFooter = styled.div`
    padding: 10px;
    border-top: 1px solid #ddd;
`;

const Input = styled.input`
    width: calc(100% - 20px);
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const FloatingChat = ({ onClose }) => {
    return (
        <ChatContainer>
            <ChatHeader>
                AI assistant
                <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', color: 'white' }}>X</button>
            </ChatHeader>
            <ChatBody>
                <IntroMessage>ברוכים הבאים לצ'אט עם עוזרת בינה מלאכותית!</IntroMessage>
                {/* Chat messages will go here */}
            </ChatBody>
            <ChatFooter>
                <Input type="text" placeholder="Type a message..." />
            </ChatFooter>
        </ChatContainer>
    );
};

export default FloatingChat;