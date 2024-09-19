import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';

const CarouselContainer = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    padding: 1rem;
    overflow: hidden;
`;

const StyledImage = styled.img`
    width: 100%;
    height: 500px; /* Set a fixed height */
    object-fit: cover; /* Maintain aspect ratio */
    border-radius: 10px;
`;

const ImageCarousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <CarouselContainer>
            <Slider {...settings}>
                <div>
                    <StyledImage src={require('../images/Carousel/image2.png')} alt="image2" />
                </div>
                <div>
                    <StyledImage src={require('../images/Carousel/image3.jpg')} alt="image3" />
                </div>
                <div>
                    <StyledImage src={require('../images/Carousel/image4.jpg')} alt="image4" />
                </div>
                <div>
                    <StyledImage src={require('../images/Carousel/image5.jpeg')} alt="image5" />
                </div>
                <div>
                    <StyledImage src={require('../images/Carousel/image6.jpg')} alt="image6" />
                </div>
            </Slider>
        </CarouselContainer>
    );
};

export default ImageCarousel;