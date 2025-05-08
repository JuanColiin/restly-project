import { useEffect, useState, useContext } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../../context/AuthContext';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showReservationMessage, setShowReservationMessage] = useState(false);
  const [fromReservation, setFromReservation] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fromRedirect = sessionStorage.getItem('redirectAfterLogin');
    if (fromRedirect?.includes('/details/')) {
      setShowReservationMessage(true);
      setFromReservation(true); // <-- para mostrar la alerta luego del login
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, formData);

      const userData = {
        token: response.data.token,
        firstname: response.data.firstname,
        email: response.data.email,
        role: response.data.role,
        userId: response.data.userId
      };

      login(userData);

      const isMobile = window.innerWidth <= 768;
      if (userData.role === 'ROLE_ADMIN' && isMobile) {
        Swal.fire({
          title: 'Atención',
          text: 'El panel de administrador solo está disponible en la versión de escritorio.',
          icon: 'info',
          confirmButtonColor: '#00c98c',
        });
      }

      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');

      if (fromReservation) {
        Swal.fire({
          title: 'Bienvenido',
          text: 'Has iniciado sesión correctamente. Ahora puedes continuar con tu reserva.',
          icon: 'success',
          confirmButtonColor: '#00c98c',
        }).then(() => {
          navigate(redirectPath);
        });
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      console.error('Error en el login:', err);
      const backendMessage = err?.response?.data?.error;
      if (backendMessage && backendMessage.includes("User not found")) {
        setError("El correo electrónico no está registrado. Por favor registrate.");
      } else {
        setError("Correo electrónico o contraseña incorrectos");
      }
    }
  };

  return (
    <div className="login-container">
      <h1 className='titleForm'>Iniciar Sesión</h1>

      {showReservationMessage && (
        <p className="reservation-warning">
          Debes iniciar sesión para poder realizar una reserva. Si aún no tenés cuenta, <Link to="/singup">registrate aquí</Link>.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group password-wrapper">
          <label htmlFor="password">Contraseña</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Ingresar
        </button>

        {error && <p className="error-message">{error}</p>}

        <p className="register-link">
          ¿Aún no tenés cuenta? <Link to="/singup">Registrate</Link>
        </p>
      </form>
    </div>
  );
}
