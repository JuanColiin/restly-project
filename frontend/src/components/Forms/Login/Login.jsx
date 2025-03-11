import { useState, useContext } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

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
      const response = await axios.post('http://localhost:8080/auth/login', formData);


      const userData = {
        token: response.data.token,
        firstname: response.data.firstname,
        email: response.data.email,
        role: response.data.role, 
        userId: response.data.userId
      };

   
      login(userData);


      navigate('/');
    } catch (err) {
      console.error('Error en el login:', err);
      setError('Correo electrónico o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <h1 className='titleForm'>Iniciar Sesión</h1>
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

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
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

