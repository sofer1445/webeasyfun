import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Heading = styled.h1`
    font-size: 3rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
`;

const DynamicHeading = ({ loading }) => {
    const [dynamicText, setDynamicText] = useState('Fetching your perfect event...');

    const headings = [
        'Just a few moments away from your perfect event...',
        'We are bringing you the best suggestions in a few seconds...',
        'Hold tight, your perfect venue is on its way...'
    ];

    useEffect(() => {
        if (!loading) return; // אם הטעינה הסתיימה, לא להפעיל את ה-interval

        const interval = setInterval(() => {
            setDynamicText(prevText => {
                const currentIndex = headings.indexOf(prevText);
                return headings[(currentIndex + 1) % headings.length];
            });
        }, 3000); // שינוי כל 3 שניות

        return () => clearInterval(interval); // ניקוי ה-interval כשמחלקת ה-react מתפרקת או כש-loading משתנה
    }, [loading]);

    return loading ? <Heading>{dynamicText}</Heading> : null; // מציג את הכיתוב רק אם טעינה
};

export default DynamicHeading;
