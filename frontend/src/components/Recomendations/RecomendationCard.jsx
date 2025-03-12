import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { IconButton, SvgIcon } from "@mui/material";
import {
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
  const productsPerPage = 10;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

  return (
    <>
      <div className="cards-container">
        {currentProducts.map((product, index) => (
          <div className="card" key={index}>
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
                <IconButton className="favorite-button">
                  <HeartIcon />
                </IconButton>
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
    </>
  );
};

RecomendationCard.propTypes = {
  products: PropTypes.array.isRequired,
};
