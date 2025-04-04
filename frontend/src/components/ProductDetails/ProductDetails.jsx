import { useState, useEffect, useRef, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  Close,
  Favorite,
} from "@mui/icons-material";
import { Tooltip, IconButton, Snackbar, Alert } from "@mui/material";
import CalendarAvailability from "../CalendarAvailability/CalendarAvailability";
import AuthContext from "../../context/AuthContext";
import ShareModal from './ShareModal';
import ShareIcon from '@mui/icons-material/Share';



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

  const normalizedFeature = feature.title.toLowerCase().replace(/\s+/g, "");
  return featuresMap[normalizedFeature] || { icon: null, name: feature.title };
};

const ProductDetails = () => {
  const { id } = useParams();
  const productId = Number(id); // Convertir a número aquí
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const closeButtonRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);
  const { user } = useContext(AuthContext);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const handleOpenShareModal = () => setIsShareModalOpen(true);
  const handleCloseShareModal = () => setIsShareModalOpen(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const productResponse = await fetch(`http://localhost:8080/products/${productId}`, {
          signal: controller.signal,
        });
        if (!productResponse.ok) throw new Error("Error al obtener los datos del producto.");
        const productData = await productResponse.json();
        setProduct(productData);

        if (user?.token) {
          const favResponse = await fetch(`http://localhost:8080/favorites/${productId}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            signal: controller.signal,
          });
          if (favResponse.ok) {
            const favStatus = await favResponse.json();
            setIsFavorite(favStatus);
          }
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching data:", error);
          setError("Error al cargar el producto. Por favor, inténtalo de nuevo.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [productId, user]);

  useEffect(() => {
    Modal.setAppElement("#root");

    const handleResize = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (modalIsOpen && closeButtonRef.current) closeButtonRef.current.focus();
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

  const toggleFavorite = async () => {
    if (!user) {
      setSnackbarMessage("Debes iniciar sesión para agregar a favoritos");
      setSnackbarOpen(true);
      return;
    }

    try {
      const endpoint = `http://localhost:8080/favorites/${productId}`;
      const method = isFavorite ? "DELETE" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        setSnackbarMessage(
          isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos"
        );
        setSnackbarOpen(true);
      } else {
        throw new Error(`Error al ${isFavorite ? "eliminar" : "agregar"} favorito`);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setSnackbarMessage(
        `Error al ${isFavorite ? "eliminar" : "agregar"} favorito. Inténtalo de nuevo.`
      );
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  if (isLoading) {
    return (
      <div className="product-details-container loading">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-container error">
        <p>{error}</p>
        <button onClick={() => navigate("/")} className="back-button">
          Volver al inicio
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-container">
        <p>No se encontró el producto.</p>
      </div>
    );
  }




  return (
    <div className="product-details-container">
      <div className="product-header">
        <h2 className="product-title">{product.title}</h2>
        <div className="product-actions">
          <Tooltip title="Compartir producto">
            <ShareIcon
              style={{ cursor: 'pointer', fontSize: 28, color: '#555' }}
              onClick={handleOpenShareModal}
            />

            {isShareModalOpen && (
              <ShareModal product={product} onClose={handleCloseShareModal} />
            )}
          </Tooltip>

          <Tooltip title={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}>
            <IconButton
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
              className="favorite-btn"
            >
              <Favorite fontSize="large" color={isFavorite ? "error" : "disabled"} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Volver al inicio">
            <IconButton component={Link} to="/" className="back-btn" aria-label="Volver al inicio">
              <ArrowBack fontSize="large" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <p className="product-category">{product.category?.name}</p>
      <p className="product-address">
        <Place /> {product.address?.street} {product.address?.number}, {product.address?.city?.name},{" "}
        {product.address?.city?.state?.country?.name}
      </p>

      {isMobile ? (
        <ImageCarousel productId={productId} />
      ) : (
        product.images?.length > 0 && (
          <div className="image-gallery">
            <img
              className="main-image"
              src={product.images[0].imageUrl}
              alt="Principal"
              onClick={openModal}
            />
            <div className="grid-images">
              {product.images.slice(1, 5).map((img, index) => (
                <img
                  key={index}
                  className="grid-image"
                  src={img.imageUrl}
                  alt={img.title || "Imagen"}
                  onClick={openModal}
                />
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
        <p className="product-description">{product.description}</p>
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

      <div className="product-policies-section">
        <h2 className="title-policy-section">Políticas del lugar</h2>
        <div className="product-policies-container">
          <div className="policy-block">
            <h3 className="product-policies-title">Reglas</h3>
            <p className="product-policies">{product.policy.rules}</p>
          </div>
          <div className="policy-block">
            <h3 className="product-policies-title">Política de seguridad</h3>
            <p className="product-policies">{product.policy.security}</p>
          </div>
          <div className="policy-block">
            <h3 className="product-policies-title">Política de cancelación</h3>
            <p className="product-policies">{product.policy.cancellation}</p>
          </div>
        </div>
      </div>




      <div className="availability-section">
        <h3 className="availability-title">Fechas Disponibles</h3>
        <CalendarAvailability productId={productId} />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductDetails;