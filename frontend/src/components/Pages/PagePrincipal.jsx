import { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import CategoryCarousel from "../CouroselCategory/CategoryCarousel";
import { RecomendationCard } from "../Recomendations/RecomendationCard";
import CategoryFilter from "../CategoryFilter/CategoryFilter";

export const PagePrincipal = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  return (
    <>
      <NavBar />
      <CategoryCarousel onSelectCategory={setProducts} />
      <CategoryFilter onProductsUpdate={setProducts} />
      <RecomendationCard products={products} />
    </>
  );
};
