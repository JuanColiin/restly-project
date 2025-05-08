import Swal from 'sweetalert2';
import './WhatsAppButton.css';
import { FaWhatsapp } from 'react-icons/fa';
import PropTypes from 'prop-types';

const WhatsAppButton = ({ phoneNumber, productName }) => {
  const handleClick = () => {
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      Swal.fire({
        icon: 'error',
        title: 'Número inválido',
        text: 'El número de WhatsApp no es válido.',
      });
      return;
    }

    const message = `¡Hola! Tengo una duda sobre la propiedad "${productName}".`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;

    const newWindow = window.open(whatsappUrl, '_blank');

    if (!newWindow) {
      Swal.fire({
        icon: 'error',
        title: 'Redirección bloqueada',
        text: 'Tu navegador bloqueó la ventana emergente. Habilita los pop-ups para contactar por WhatsApp.',
      });
      return;
    }

    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Mensaje preparado',
        text: 'Tu mensaje de WhatsApp está listo para enviar. Si no se abrió WhatsApp, revisa tu conexión o bloqueadores.',
        timer: 3000,
        showConfirmButton: false,
      });
    }, 1500);
  };

  return (
    <div className="whatsapp-button-container">
      <button
        className="whatsapp-button"
        onClick={handleClick}
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp size={28} />
        <span className="tooltip-text">¿Tienes dudas? ¡Escríbenos por WhatsApp!</span>
      </button>
    </div>
  );
};

WhatsAppButton.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
};

export default WhatsAppButton;
