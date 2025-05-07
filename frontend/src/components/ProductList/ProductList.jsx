import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ProductList.css';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/products`)
      .then(response => setProducts(response.data))
      .catch(error => {
        console.error('Error fetching products:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los productos.',
          confirmButtonColor: '#00c98c',
        });
      });
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el producto y todas las reservas asociadas de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c98c',    
      cancelButtonColor: '#2b2c28',      
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'restly-alert',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${apiUrl}/products/${id}`, {
          headers: {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user'))?.token || JSON.parse(sessionStorage.getItem('user'))?.token}`
          }
        })
          .then(() => {
            setProducts(products.filter(product => product.id !== id));
            Swal.fire({
              title: 'Eliminado',
              text: 'El producto ha sido eliminado.',
              icon: 'success',
              confirmButtonColor: '#00c98c',
            });
          })
          .catch(error => {
            console.error('Error deleting product:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al eliminar el producto.',
              confirmButtonColor: '#00c98c',
            });
          });
      }
    });
  };

  return (
    <div className="product-list">
      <h2>Lista de Propiedades</h2>
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
                <button className="delete-btn-product" onClick={() => handleDelete(product.id)}>Eliminar</button>
                <Link to={`/edit/${product.id}`}>
                  <button className="edit-btn-list">Actualizar</button>
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
