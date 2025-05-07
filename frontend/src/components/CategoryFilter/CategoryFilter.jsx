import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./CategoryFilter.css";

const CategoryFilter = ({ onProductsUpdate }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/categories`)
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const fetchProducts = () => {
    if (selectedCategories.length === 0) {
      axios.get(`${apiUrl}/products`)
        .then(response => {
          onProductsUpdate(response.data); 
          setTotalProducts(response.data.length);
        })
        .catch(error => console.error("Error fetching all products:", error));
      return;
    }
    

    const requests = selectedCategories.map(id =>
      axios.get(`${apiUrl}/products/category/${id}`)
    );

    Promise.all(requests)
      .then(responses => {
        const products = responses.flatMap(res => res.data);
        setTotalProducts(products.length);
        onProductsUpdate(products);
      })
      .catch(error => console.error("Error fetching filtered products:", error));
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    fetchProducts();
  };

  return (
    <> 
    <h1>Recomendaciones</h1>
    <div className="category-filter-container">
    
      <div className={`category-filter ${isOpen ? "open" : ""}`}>
        <h2 onClick={() => setIsOpen(!isOpen)}>
          Filtrar por categorías
          <span className={`dropdown-icon ${isOpen ? "rotated" : ""}`}>&#9660;</span>
        </h2>
        {isOpen && (
          <>
            <p>Mostrando {totalProducts} productos</p>
            <div className="category-list">
              {categories.map(category => (
                <label key={category.id} className="category-item">
                  <input 
                    type="checkbox" 
                    value={category.id} 
                    checked={selectedCategories.includes(category.id)} 
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <span>{category.name} ({category.totalProducts})</span>
                </label>
              ))}
            </div>
            <div className="category-filter-buttons">
              <button onClick={fetchProducts} className="category-filter-btn">
                Filtrar
              </button>
              <button onClick={clearFilters} className="category-filter-clear-btn">
                Limpiar Filtros
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

CategoryFilter.propTypes = {
  onProductsUpdate: PropTypes.func.isRequired
};

export default CategoryFilter;
