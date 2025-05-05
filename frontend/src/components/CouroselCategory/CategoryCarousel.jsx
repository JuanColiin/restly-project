import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./CategoryCarousel.css";

export default function CategoryCarousel({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const carouselRef = useRef(null);

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

  // Scroll horizontal con mouse en desktop
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      carousel.classList.add("grabbing");
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      carousel.classList.remove("grabbing");
    };

    const handleMouseUp = () => {
      isDown = false;
      carousel.classList.remove("grabbing");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;
    };

    carousel.addEventListener("mousedown", handleMouseDown);
    carousel.addEventListener("mouseleave", handleMouseLeave);
    carousel.addEventListener("mouseup", handleMouseUp);
    carousel.addEventListener("mousemove", handleMouseMove);

    return () => {
      carousel.removeEventListener("mousedown", handleMouseDown);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
      carousel.removeEventListener("mouseup", handleMouseUp);
      carousel.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const scrollAmount = 370; // ancho de una tarjeta aprox.
    carousel.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  };

  const handleCategoryClick = async (categoryId) => {
    try {
      const response = await axios.get(`${apiUrl}/products/category/${categoryId}`);
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
      <div className="carousel-wrapper">
        <button className="carousel-button left" onClick={() => scrollCarousel(-1)}>
          &#8249;
        </button>

        <div className="carousel-container" ref={carouselRef}>
          {loading && <p>Cargando categorías...</p>}

          {!loading && error && (
            <p className="error-message">No se pudieron cargar las categorías.</p>
          )}

          {!loading && !error && categories.length === 0 && (
            <p>No hay categorías registradas aún.</p>
          )}

          {!loading &&
            !error &&
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

        <button className="carousel-button right" onClick={() => scrollCarousel(1)}>
          &#8250;
        </button>
      </div>
    </>
  );
}

CategoryCarousel.propTypes = {
  onSelectCategory: PropTypes.func.isRequired,
};
