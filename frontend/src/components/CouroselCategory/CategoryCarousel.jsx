import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Importamos PropTypes
import axios from "axios";
import "./CategoryCarousel.css";

export default function CategoryCarousel({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <h1>Buscar por tipo de alojamiento</h1>
      <div className="carousel-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="carousel-card"
            onClick={() => onSelectCategory(category.id)}
          >
            <div className="carousel-card-image">
              <img
                src={category.imageUrl || "/placeholder.svg"}
                alt={category.name}
              />
            </div>
            <div className="carousel-card-content">
              <h3>{category.name}</h3>
              <p>Disponibles: {category.totalProducts}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}


CategoryCarousel.propTypes = {
  onSelectCategory: PropTypes.func.isRequired,
};
