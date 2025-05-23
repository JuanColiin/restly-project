import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageCarousel.css";

const CustomPrevArrow = ({ onClick }) => (
    <div className="custom-arrow-container">
        <button className="custom-arrow prev-arrow" onClick={onClick}>
            <FiChevronLeft />
        </button>
    </div>
);

const CustomNextArrow = ({ onClick }) => (
    <div className="custom-arrow-container">
        <button className="custom-arrow next-arrow" onClick={onClick}>
            <FiChevronRight />
        </button>
    </div>
);

CustomPrevArrow.propTypes = {
    onClick: PropTypes.func,
};

CustomNextArrow.propTypes = {
    onClick: PropTypes.func,
};

const ImageCarousel = ({ productId }) => {
    const [images, setImages] = useState([]);
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (!productId) return;

        fetch(`${apiUrl}/products/${productId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.images) {
                    setImages(data.images);
                }
            })
            .catch((error) => console.error("Error al obtener imágenes:", error));
    }, [productId]);

    if (images.length === 0) return null;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="image-carousel">
            <Slider {...settings}>
                {images.map((img, index) => (
                    <div key={index} className="carousel-item">
                        <img src={img.imageUrl} alt={img.title || "Imagen"} className="carousel-image" />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

ImageCarousel.propTypes = {
    productId: PropTypes.string.isRequired,
};

export default ImageCarousel;