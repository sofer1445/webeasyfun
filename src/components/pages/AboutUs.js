import React from 'react';
import styled from 'styled-components';
import BackButtonComponent from '../../Styled/BackButton';

const AboutUsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f5f5f5;
`;

const Heading = styled.h1`
    font-size: 3rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 2rem;
`;

const Content = styled.div`
    max-width: 800px;
    text-align: center;
    line-height: 1.6;
`;

const Paragraph = styled.p`
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 1.5rem;
`;

const AboutUs = () => {
    return (
        <AboutUsContainer>
            <BackButtonComponent />
            <Heading>About Us</Heading>
            <Content>
                <Paragraph>
                    Welcome to EASY FUN, your ultimate destination for effortless event planning. We understand the challenges of organizing events within a budget, which is why our platform is designed to streamline the process and make it a delightful experience.
                </Paragraph>
                <Paragraph>
                    At Easy Fun, we believe that every event should be a memorable occasion, and our team of experienced professionals is dedicated to helping you bring your vision to life. With our innovative technology and personalized recommendations, we take the guesswork out of event planning, ensuring that you can focus on what truly matters – creating unforgettable experiences.
                </Paragraph>
                <Paragraph>
                    Our user-friendly interface guides you through each step of the planning process, from setting your budget to selecting the perfect venue, catering, entertainment, and more. We work closely with trusted vendors and partners to offer you a wide range of options, ensuring that you can find the perfect fit for your unique requirements.
                </Paragraph>
                <Paragraph>
                    Join the Easy Fun community today and discover the joy of stress-free event planning. Let us help you create extraordinary moments that will be cherished for years to come.
                </Paragraph>
            </Content>
        </AboutUsContainer>
    );
};

export default AboutUs;