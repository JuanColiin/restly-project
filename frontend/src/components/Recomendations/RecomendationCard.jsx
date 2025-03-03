import { Heart, MapPin } from "lucide-react";
import { FiWifi } from "react-icons/fi";
import { FaSwimmingPool, FaAirFreshener, FaParking, FaDumbbell, FaPaw, FaUtensils, FaShuttleVan, FaWheelchair } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiOutlineDoubleLeft, AiOutlineLeft, AiOutlineRight, AiOutlineDoubleRight } from "react-icons/ai"; 
import "./RecomendationCard.css";
import { useEffect, useState } from "react";

const getFeatureIcon = (feature, size = 20) => {
  const icons = {
    wifi: FiWifi,
    pool: FaSwimmingPool,
    airconditioning: FaAirFreshener,
    parking: FaParking,
    gym: FaDumbbell,
    petsallowed: FaPaw,
    breakfastincluded: FaUtensils,
    airportshuttle: FaShuttleVan,
    wheelchairaccessible: FaWheelchair,
  };

  const normalizedFeature = feature.trim().toLowerCase().replace(/\s+/g, "");
  const IconComponent = icons[normalizedFeature];

  return IconComponent ? <IconComponent size={size} /> : null;
};

export const RecomendationCard = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        let data = await response.json();

        data = data.sort(() => Math.random() - 0.5);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <>
      <h1>Recomendaciones</h1>
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
                <button className="favorite-button">
                  <Heart />
                </button>
                <h3 className="card-title">{product.title}</h3>
              </div>

              <div className="address">
                <MapPin />
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
        <button onClick={handleFirstPage} disabled={currentPage === 1}>
          <AiOutlineDoubleLeft />
        </button>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          <AiOutlineLeft />
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          <AiOutlineRight />
        </button>
        <button onClick={handleLastPage} disabled={currentPage === totalPages}>
          <AiOutlineDoubleRight />
        </button>
      </div>
    </>
  );
};
