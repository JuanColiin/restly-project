import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Modal from "react-modal";
import "./ProductDetails.css";
import ImageCarousel from "./ImageCarousel";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
    Wifi,
    Pool,
    AcUnit,
    LocalParking,
    FitnessCenter,
    Pets,
    Restaurant,
    AirportShuttle,
    Accessible,
    Place,
    ArrowBack,
    Close
} from "@mui/icons-material";

const getFeatureIconAndName = (feature) => {
    if (!feature?.title) return { icon: null, name: "Desconocido" };

    const featuresMap = {
        wifi: { icon: <Wifi />, name: "Wi-Fi" },
        pool: { icon: <Pool />, name: "Piscina" },
        airconditioning: { icon: <AcUnit />, name: "Aire acondicionado" },
        parking: { icon: <LocalParking />, name: "Parqueadero" },
        gym: { icon: <FitnessCenter />, name: "Gimnasio" },
        petsallowed: { icon: <Pets />, name: "Mascotas permitidas" },
        breakfastincluded: { icon: <Restaurant />, name: "Desayuno incluido" },
        airportshuttle: { icon: <AirportShuttle />, name: "Transporte al aeropuerto" },
        wheelchairaccessible: { icon: <Accessible />, name: "Accesible para sillas de ruedas" },
    };

    const normalizedFeature = feature.title.trim().toLowerCase().replace(/\s+/g, "");
    return featuresMap[normalizedFeature] || { icon: null, name: feature.title };
};

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const closeButtonRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        fetch(`http://localhost:8080/products/${id}`)
            .then((response) => response.json())
            .then((data) => setProduct(data))
            .catch((error) => console.error("Error fetching product:", error));
    }, [id]);

    useEffect(() => {
        Modal.setAppElement("#root");

        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (modalIsOpen && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    }, [modalIsOpen]);

    const openModal = () => {
        if (product?.images?.length > 0) {
            setModalImages([...product.images]);
            setModalIsOpen(true);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setModalImages([]);
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
    };

    if (!product) return <p>Cargando...</p>;

    return (
        <div className="product-details-container">
            <div className="product-header">
                <h2 className="product-title">{product.title}</h2>
                <Link to="/" className="back-to-home">
                    <ArrowBack fontSize="large" />
                </Link>
            </div>
            <p className="product-category">{product.category?.name}</p>
            <p className="product-address">
                <Place /> {product.address?.street} {product.address?.number}, {product.address?.city?.name}, {product.address?.city?.state?.country?.name}
            </p>

            {isMobile ? (
                <ImageCarousel productId={id} />
            ) : (
                product.images?.length > 0 && (
                    <div className="image-gallery">
                        <img className="main-image" src={product.images[0].imageUrl} alt="Principal" />
                        <div className="grid-images">
                            {product.images.slice(1, 5).map((img, index) => (
                                <img key={index} className="grid-image" src={img.imageUrl} alt={img.title || "Imagen"} />
                            ))}
                        </div>
                        {product.images.length > 1 && (
                            <button className="view-more-btn" onClick={openModal}>
                                Ver más fotografías del lugar
                            </button>
                        )}
                    </div>
                )
            )}

            <div className="product-description-section">
                <h3 className="product-description-title">Descripción</h3>
                <p className="product-description formatted-text">{product.description}</p>
            </div>

            <div className="features-section">
                <h3 className="features-title">Características</h3>
                <ul className="features-list">
                    {product.features?.map((feature, index) => {
                        const { icon, name } = getFeatureIconAndName(feature);
                        return (
                            <li key={index} className="feature-item">
                                {icon} <span>{name}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Modal de imágenes */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="modal-content"
                overlayClassName="modal-overlay"
                shouldCloseOnOverlayClick={true}
            >
                <button className="close-btn" onClick={closeModal} ref={closeButtonRef}>
                    <Close fontSize="large" />
                </button>

                {modalImages.length > 0 ? (
                    <Slider {...sliderSettings} className="slider">
                        {modalImages.map((img, index) => (
                            <div key={index} className="slider-item">
                                <img className="slider-image" src={img.imageUrl} alt={img.title || "Imagen"} />
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p>No hay imágenes disponibles.</p>
                )}
            </Modal>
        </div>
    );
};

export default ProductDetails;
