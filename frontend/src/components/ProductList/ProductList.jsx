import { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css'; // Archivo de estilos CSS

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/products')
      .then(response => {
        setProducts(response.data); 
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };

  const handleUpdate = (id) => {
    console.log(`Updating product with id: ${id}`);
  };

  const handleViewDetails = (id) => {
    console.log(`Viewing details of product with id: ${id}`);
  };

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>Actions</th>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                <button onClick={() => handleUpdate(product.id)}>Actualizar</button>
                <button onClick={() => handleViewDetails(product.id)}>Ver Detalles</button>
              </td>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.category?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
