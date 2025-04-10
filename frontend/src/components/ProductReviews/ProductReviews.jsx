import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import './ProductReviews.css';
import { FaStar } from 'react-icons/fa';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const ProductReviews = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/reviews/product/${productId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error al obtener reseñas", err);
    }
  };

  const fetchAverage = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/reviews/products/average-ratings`, {
        params: {
          productIds: [productId],
        },
      });

      setAverageRating(res.data[productId] || 0.0);
    } catch (err) {
      console.error("Error al obtener promedio", err);
    }
  };


  const checkIfUserCanReview = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/reserves/has-finished?productId=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return res.data; // true o false
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
        icon: 'info',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    try {
      const reviewData = {
        productId,
        rating: newReview.rating,
        comment: newReview.comment,
      };

      await axios.post('http://localhost:8080/reviews', reviewData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setNewReview({ rating: 0, comment: '' });
      await fetchReviews();
      await fetchAverage();
      Swal.fire('¡Gracias!', 'Tu reseña fue enviada con éxito', 'success');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'No se pudo enviar la reseña', 'error');
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:8080/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      await fetchReviews();
      await fetchAverage();
      Swal.fire('Eliminada', 'Tu reseña ha sido eliminada', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la reseña', 'error');
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchAverage();
  }, [productId]);

  return (
    <div className="product-reviews-container">
      <h2>Valoraciones</h2>

      <div className="average-rating">
        <strong>Promedio:</strong>{' '}
        {averageRating !== null ? `${averageRating.toFixed(1)} / 5` : 'Cargando...'}
        <div className="stars">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} color={i < Math.round(averageRating || 0) ? '#ffc107' : '#e4e5e9'} />
          ))}
        </div>
      </div>

      {user && (
        <form className="review-form" onSubmit={handleSubmit}>
          <label htmlFor="rating">Tu puntuación:</label>
          <div className="star-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                color={star <= newReview.rating ? '#ffc107' : '#e4e5e9'}
                onClick={() => setNewReview({ ...newReview, rating: star })}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
          <textarea
            placeholder="Escribe un comentario..."
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            required
          />
          <button type="submit">Enviar reseña</button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div className="review-card" key={r.id}>
              <div className="review-header">
                <strong>{r.userName}</strong> —{' '}
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < r.rating ? '#ffc107' : '#e4e5e9'} />
                ))}
              </div>
              <p>{r.comment}</p>
              {user?.email === r.userEmail && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(r.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Aún no hay reseñas para este producto.</p>
        )}
      </div>
    </div>
  );
};

ProductReviews.propTypes = {
  productId: PropTypes.number.isRequired,
};

export default ProductReviews;
