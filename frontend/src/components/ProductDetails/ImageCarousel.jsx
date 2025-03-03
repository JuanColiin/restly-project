import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageCarousel.css";

const CustomPrevArrow = ({ onClick }) => (
    <button className="custom-arrow prev-arrow" onClick={onClick}>
        <FiChevronLeft />
    </button>
);

const CustomNextArrow = ({ onClick }) => (
    <button className="custom-arrow next-arrow" onClick={onClick}>
        <FiChevronRight />
    </button>
);

// 🔹 Validación de PropTypes para las flechas
CustomPrevArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
};

CustomNextArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
};

const ImageCarousel = ({ productId }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (!productId) return;

        fetch(`http://localhost:8080/products/${productId}`)
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
