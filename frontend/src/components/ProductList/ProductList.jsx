import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      axios.delete(`http://localhost:8080/products/${id}`)
        .then(() => setProducts(products.filter(product => product.id !== id)))
        .catch(error => console.error('Error deleting product:', error));
    }
  };

  return (
    <div className="product-list">
      <h2>Lista de Productos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Categoría</th>
            <th className="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.category?.name}</td>
              <td className="actions">
                <button className="delete-btn" onClick={() => handleDelete(product.id)}>Eliminar</button>
                <Link to={`/edit/${product.id}`}>
                  <button className="edit-btn">Actualizar</button>
                </Link>
                <Link to={`/details/${product.id}`}>
                  <button className="details-btn">Detalles</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
