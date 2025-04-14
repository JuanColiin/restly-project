import { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import CategoryCarousel from "../CouroselCategory/CategoryCarousel";
import { RecomendationCard } from "../Recomendations/RecomendationCard";
import CategoryFilter from "../CategoryFilter/CategoryFilter";

export const PagePrincipal = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setAllProducts(data); 
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setProducts(allProducts);
    } else {
      const filteredProducts = allProducts.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  };

  return (
    <>
      <NavBar setFilteredProducts={setProducts} onSearch={handleSearch} />
      <CategoryCarousel onSelectCategory={setProducts} />
      <CategoryFilter onProductsUpdate={setProducts} />
      <RecomendationCard products={products} />
    </>
  );
};
