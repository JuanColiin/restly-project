import { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { IconButton, SvgIcon, Snackbar, Alert, Tooltip } from "@mui/material";
import {
  Favorite as HeartFilledIcon,
  FavoriteBorder as HeartIcon,
  LocationOn as MapPinIcon,
  FirstPage as FirstPageIcon,
  NavigateBefore as PrevPageIcon,
  NavigateNext as NextPageIcon,
  LastPage as LastPageIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import * as MuiIcons from "@mui/icons-material";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import "./RecomendationCard.css";

const getFeatureIcon = (feature, size = 20) => {
  if (!feature?.icon) return null;

  const IconComponent = MuiIcons[feature.icon];

  return IconComponent ? (
    <SvgIcon component={IconComponent} style={{ fontSize: size, color: "#00c98c" }} />
  ) : null;
};
export const RecomendationCard = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [favoritesStatus, setFavoritesStatus] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [averageRatings, setAverageRatings] = useState({});
  const { user } = useContext(AuthContext);
  const productsPerPage = 10;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.token) {
        setFavoritesStatus({});
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/favorites", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (response.ok) {
          const favoriteProducts = await response.json();
          const favoriteIds = new Set(favoriteProducts.map((product) => product.id));
          const updatedFavorites = {};

          currentProducts.forEach((product) => {
            updatedFavorites[product.id] = favoriteIds.has(product.id);
          });

          setFavoritesStatus(updatedFavorites);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [currentPage, user, products]);

  const fetchedIdsRef = useRef (new Set());

  useEffect(() => {
    const productIds = currentProducts
      .map(product => product.id)
      .filter(id => !fetchedIdsRef.current.has(id));
  
    if (productIds.length === 0) return;
  
    const fetchAverages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/reviews/average-ratings?productIds=${productIds.join(",")}`
        );
        setAverageRatings(prev => ({ ...prev, ...res.data }));
  
        productIds.forEach(id => fetchedIdsRef.current.add(id));
      } catch (err) {
        console.error("Error al obtener promedios", err);
      }
    };
  
    fetchAverages();
  }, [currentProducts]);
  

  const toggleFavorite = async (productId) => {
    if (!user) {
      setSnackbarMessage("Debes iniciar sesión para agregar a favoritos");
      setSnackbarOpen(true);
      return;
    }

    const isCurrentlyFavorite = favoritesStatus[productId] || false;

    try {
      const response = await fetch(
        `http://localhost:8080/favorites/${productId}`,
        {
          method: isCurrentlyFavorite ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        setFavoritesStatus((prev) => ({
          ...prev,
          [productId]: !isCurrentlyFavorite,
        }));
        setSnackbarMessage(
          isCurrentlyFavorite ? "Eliminado de favoritos" : "Agregado a favoritos"
        );
        setSnackbarOpen(true);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setSnackbarMessage(`Error al ${isCurrentlyFavorite ? "eliminar" : "agregar"} favorito`);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <>
      <div className="cards-container">
        {currentProducts.map((product) => (
          <div className="card" key={product.id}>
            <div className="card-image-container">
              <img
                src={product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3'}
                alt={product.images?.[0]?.title || product.title}
                className="card-image"
              />
              <div className="category-badge">
                <span>{product.category.name}</span>
              </div>
            </div>

            <div className="card-content">
              <div className="title-content stars-row">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Tooltip
                    title={favoritesStatus[product.id] ? "Eliminar de favoritos" : "Agregar a favoritos"}
                    arrow
                    placement="top"
                  >
                    <IconButton
                      className="favorite-button"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      {favoritesStatus[product.id] ? (
                        <HeartFilledIcon style={{ color: '#ff5a5f' }} />
                      ) : (
                        <HeartIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <h3 className="card-title">{product.title}</h3>
                </div>

                {averageRatings[product.id] > 0 && (
                  <div className="stars-container">
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon
                        key={i}
                        fontSize="0.5px"
                        style={{ color: i < Math.round(averageRatings[product.id]) ? "#FFC107" : "#E0E0E0" }}
                      />
                    ))}
                    <span className="rating-number">{averageRatings[product.id].toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="address">
                <MapPinIcon />
                <span>
                  {product.address.street}, {"#  "}{product.address.number}, {product.address.city.name}
                </span>
              </div>

              <p className="description">{product.shortDescription}</p>

              <div className="features">
              {product.features?.map((feature, index) => (
  <div key={index} className="feature" title={feature.title}>
    {getFeatureIcon(feature)}
  </div>
))}

              </div>

              <div className="button-container">
                <Link to={`/details/${product.id}`}>
                  <button className="details-button">Ver detalles</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination">
        <IconButton onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          <FirstPageIcon />
        </IconButton>
        <IconButton onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          <PrevPageIcon />
        </IconButton>
        <span>Página {currentPage} de {totalPages}</span>
        <IconButton onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          <NextPageIcon />
        </IconButton>
        <IconButton onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
          <LastPageIcon />
        </IconButton>
      </div>

      {/* Notificación */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

RecomendationCard.propTypes = {
  products: PropTypes.array.isRequired,
};
