import { Heart, MapPin } from "lucide-react";
import "./RecomendationCard.css";
import { useEffect, useState } from "react";




export const RecomendationCard = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
  }, []);






  return (

    <>

    <h1>Recomendaciones</h1>
      <div className="cards-container">

        {products.map((product, index) => (
          <div className="card" key={index}>
            <div className="card-image-container">
              <img
                src={product.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3'}
                alt={product.images[0]?.title || product.title}
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
                  {product.address.street} {product.address.number}, {product.address.city.name}
                </span>
              </div>

              <p className="description">{product.description}</p>

              <div className="features">
                {product.features.map((feature, index) => (
                  <div key={index} className="feature">
                    <span title={feature.title} />
                    <span>{feature.title}</span>
                  </div>
                ))}
              </div>

              <div className="button-container">
                <button className="details-button">Ver detalles</button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </>


  )
}
