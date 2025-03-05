import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./CategoryFilter.css";

const CategoryFilter = ({ onProductsUpdate }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:8080/categories")
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const fetchProducts = () => {
    if (selectedCategories.length === 0) {
      axios.get("http://localhost:8080/products")
        .then(response => {
          onProductsUpdate(response.data);
          setTotalProducts(response.data.length);
        })
        .catch(error => console.error("Error fetching all products:", error));
      return;
    }

    const requests = selectedCategories.map(id =>
      axios.get(`http://localhost:8080/products/category/${id}`)
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
    <div className="category-filter-container">
    <div className="category-filter">
      <h2>Filtrar por Categoría</h2>
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
      <div className="buttons-container">
      <button onClick={fetchProducts} className="search-button">
        Buscar
      </button>
      <button onClick={clearFilters} className="search-button">
        Limpiar Filtros
      </button>
        </div>
    </div>
    </div>
  );
};

CategoryFilter.propTypes = {
  onProductsUpdate: PropTypes.func.isRequired
};

export default CategoryFilter;
