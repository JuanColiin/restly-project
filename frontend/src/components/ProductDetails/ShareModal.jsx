import { useState } from 'react';
import './ShareModal.css';
import PropTypes from 'prop-types';

// Íconos de Material UI
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';

const ShareModal = ({ product, onClose }) => {
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const productUrl = `https://www.restly.com/products/${product.id}`;
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(productUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${message} ${productUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Restablecer el mensaje después de 2 segundos
    } catch (error) {
      console.error('Error al copiar el enlace:', error);
    }
  };

  const mainImage = product?.images?.length ? product.images[0].imageUrl : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">
          <CloseIcon fontSize="large" />
        </button>

        {/* Columna izquierda */}
        <div className="modal-left">
          {mainImage && <img src={mainImage} alt={product.title} className="share-image" />}
          <h3 className="share-title">{product.title}</h3>
          <p className="share-description">{product.shortDescription}</p>
        </div>

        {/* Columna derecha */}
        <div className="modal-right">
          <h2>Compartir producto</h2>
          <textarea
            className="share-textarea"
            placeholder="Agrega un mensaje personalizado..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          <div className="social-icons">
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" title="Compartir en Facebook" className="facebook">
              <FacebookIcon fontSize="large" />
            </a>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" title="Compartir en Twitter" className="twitter">
              <TwitterIcon fontSize="large" />
            </a>
            <button onClick={handleCopy} title="Copiar enlace" className="copy-btn">
              <ContentCopyIcon fontSize="large" />
            </button>
          </div>

          {copied && <p className="copy-success">¡Enlace copiado!</p>}
        </div>
      </div>
    </div>
  );
};

ShareModal.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    shortDescription: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        imageUrl: PropTypes.string,
      })
    ),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShareModal;
