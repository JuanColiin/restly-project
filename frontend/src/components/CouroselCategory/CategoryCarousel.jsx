import { useEffect, useState } from "react";
import "./CategoryCarousel.css";

export default function CategoryCarousel() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>


       <h1 >Buscar por tipo de alojamiento</h1>
      <div className="carousel-container">
     
        {categories.map((category, index) => (
          <div
            key={index}
            className="carousel-card"
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
