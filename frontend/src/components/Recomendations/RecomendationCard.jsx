import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { IconButton, SvgIcon, Snackbar, Alert } from "@mui/material";
import {
  Favorite as HeartFilledIcon,
  FavoriteBorder as HeartIcon,
  LocationOn as MapPinIcon,
  Wifi as WifiIcon,
  Pool as PoolIcon,
  AcUnit as AirConditioningIcon,
  LocalParking as ParkingIcon,
  FitnessCenter as GymIcon,
  Pets as PetsIcon,
  Restaurant as BreakfastIcon,
  AirportShuttle as ShuttleIcon,
  Accessible as WheelchairIcon,
  FirstPage as FirstPageIcon,
  NavigateBefore as PrevPageIcon,
  NavigateNext as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { Tooltip } from '@mui/material';
import AuthContext from "../../context/AuthContext";
import "./RecomendationCard.css";

const getFeatureIcon = (feature, size = 20) => {
  const icons = {
    wifi: WifiIcon,
    pool: PoolIcon,
    airconditioning: AirConditioningIcon,
    parking: ParkingIcon,
    gym: GymIcon,
    petsallowed: PetsIcon,
    breakfastincluded: BreakfastIcon,
    airportshuttle: ShuttleIcon,
    wheelchairaccessible: WheelchairIcon,
  };

  const normalizedFeature = feature.trim().toLowerCase().replace(/\s+/g, "");
  const IconComponent = icons[normalizedFeature];

  return IconComponent ? <SvgIcon component={IconComponent} fontSize="small" style={{ fontSize: size }} /> : null;
};

export const RecomendationCard = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [favoritesStatus, setFavoritesStatus] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { user } = useContext(AuthContext);
  const productsPerPage = 10;

  // Verificar estado de favoritos al cargar o cambiar productos
  useEffect(() => {
    const checkFavorites = async () => {
      if (!user?.token) {
        // Si no hay usuario, marcamos todos como no favoritos
        const initialStatus = {};
        currentProducts.forEach(product => {
          initialStatus[product.id] = false;
        });
        setFavoritesStatus(initialStatus);
        return;
      }

      const status = {};
      for (const product of currentProducts) {
        try {
          const response = await fetch(`http://localhost:8080/favorites/${product.id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          status[product.id] = response.ok ? await response.json() : false;
        } catch (error) {
          console.error(`Error checking favorite status for product ${product.id}:`, error);
          status[product.id] = false;
        }
      }
      setFavoritesStatus(status);
    };

    checkFavorites();
  }, [currentPage, user]); // Dependencias actualizadas

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

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
        setFavoritesStatus(prev => ({
          ...prev,
          [productId]: !isCurrentlyFavorite
        }));
        setSnackbarMessage(
          isCurrentlyFavorite
            ? "Eliminado de favoritos"
            : "Agregado a favoritos"
        );
        setSnackbarOpen(true);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setSnackbarMessage(
        `Error al ${isCurrentlyFavorite ? "eliminar" : "agregar"} favorito`
      );
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
              <div className="title-content">
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

              <div className="address">
                <MapPinIcon />
                <span>
                  {product.address.street}, {"#  "}{product.address.number}, {product.address.city.name}
                </span>
              </div>

              <p className="description">{product.shortDescription}</p>

              <div className="features">
                {product.features?.map((feature, index) => (
                  <div key={index} className="feature">
                    {getFeatureIcon(feature.title)}
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
        <IconButton onClick={handleFirstPage} disabled={currentPage === 1}>
          <FirstPageIcon />
        </IconButton>
        <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
          <PrevPageIcon />
        </IconButton>
        <span>Página {currentPage} de {totalPages}</span>
        <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
          <NextPageIcon />
        </IconButton>
        <IconButton onClick={handleLastPage} disabled={currentPage === totalPages}>
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