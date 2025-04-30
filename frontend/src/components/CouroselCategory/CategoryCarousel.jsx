import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./CategoryCarousel.css";

export default function CategoryCarousel({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/categories`); 
        const data = response.data;

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
          console.warn("La respuesta no es un array:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/products/category/${categoryId}`
      );
      onSelectCategory(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn(`No se encontraron productos para la categoría ID ${categoryId}.`);
        onSelectCategory([]); 
      } else {
        console.error("Error fetching products by category:", error);
      }
    }
  };
  

  return (
    <>
      <h1>Buscar por tipo de alojamiento</h1>
      <div className="carousel-container">
        {loading && <p>Cargando categorías...</p>}

        {!loading && error && (
          <p style={{ color: "red" }}>No se pudieron cargar las categorías.</p>
        )}

        {!loading && !error && categories.length === 0 && (
          <p>No hay categorías registradas aún.</p>
        )}

        {!loading &&
          !error &&
          categories.length > 0 &&
          categories.map((category) => (
            <div
              key={category.id}
              className="carousel-card"
              onClick={() => handleCategoryClick(category.id)}
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
