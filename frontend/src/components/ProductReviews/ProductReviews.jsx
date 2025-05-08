import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import './ProductReviews.css';
import { FaStar } from 'react-icons/fa';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const ProductReviews = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${apiUrl}/reviews/product/${productId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error al obtener reseñas", err);
    }
  };

  const fetchAverageAndCount = async () => {
    try {
      const avgRes = await axios.get(`${apiUrl}/reviews/average-ratings`, {
        params: { productIds: productId }
      });
      setAverageRating(avgRes.data[productId] || 0.0);

      const countRes = await axios.get(`${apiUrl}/reviews/product/${productId}/count`);
      setTotalReviews(countRes.data);
    } catch (err) {
      console.error("Error al obtener promedio o total de reseñas", err);
    }
  };

  const checkIfUserCanReview = async () => {
    if (!user?.token) return false;
    try {
      const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
      const token = storedUser?.token; 

      const res = await axios.get(
        `${apiUrl}/reserves/has-finished?productId=${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      console.error("Error al verificar permiso para reseñar", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      Swal.fire('Inicia sesión', 'Debes iniciar sesión para dejar una reseña', 'info');
      return;
    }

    const canReview = await checkIfUserCanReview();
    if (!canReview) {
      Swal.fire({
        title: 'No puedes dejar una reseña',
        text: 'Solo puedes valorar un producto después de finalizar una reserva.',
        icon: 'info'
      });
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
      const token = storedUser?.token; // Extraer token

      await axios.post(`${apiUrl}/reviews`, {
        productId,
        rating: newReview.rating,
        comment: newReview.comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewReview({ rating: 0, comment: '' });
      await fetchReviews();
      await fetchAverageAndCount();
      Swal.fire('¡Gracias!', 'Tu reseña fue enviada con éxito', 'success');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'No se pudo enviar la reseña', 'error');
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
      const token = storedUser?.token; // Extraer token

      await axios.delete(`${apiUrl}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchReviews();
      await fetchAverageAndCount();
      Swal.fire('Eliminada', 'Tu reseña ha sido eliminada', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la reseña', 'error');
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchAverageAndCount();
  }, [productId]);

  return (
    <div className="product-reviews-container">
      <h2>Valoraciones</h2>

      <div className="average-rating">
        <div className="rating-display">
          <strong>{averageRating !== null ? averageRating.toFixed(1) : '--'}</strong>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                color={i < Math.round(averageRating || 0) ? '#ffc107' : '#e4e5e9'} 
                size={14}
              />
            ))}
          </div>
        </div>
        <p>{totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}</p>
      </div>

      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div className="review-card" key={r.id}>
              <div className="review-header">
                <div>
                  <span className="review-user">{r.userName}</span>
             
                </div>

         
                <div className="review-stars">

                <span className="review-date">
                    {new Date(r.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < r.rating ? '#ffc107' : '#e4e5e9'} size={12} />
                  ))}
                </div>
              </div>
              <p className="review-content">{r.comment}</p>
              {user?.email === r.userEmail && (
                <div className="review-actions">
                  <button className="delete-btn-r" onClick={() => handleDelete(r.id)}>
                    Eliminar reseña
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-reviews">Aún no hay reseñas para este producto.</p>
        )}
      </div>

      {user && (
        <form className="review-form" onSubmit={handleSubmit}>
          <label>Tu valoración</label>
          <div className="star-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                color={star <= newReview.rating ? '#ffc107' : '#e4e5e9'}
                onClick={() => setNewReview({ ...newReview, rating: star })}
                style={{ cursor: 'pointer' }}
                size={16}
              />
            ))}
          </div>
          <textarea
            placeholder="Comparte tu experiencia con este producto..."
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            required
          />
          <button type="submit">Enviar reseña</button>
        </form>
      )}
    </div>
  );
};

ProductReviews.propTypes = {
  productId: PropTypes.number.isRequired,
};

export default ProductReviews;