import { useState } from 'react';
import './SingUp.css'
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate in real time
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: !validateEmail(value) ? 'Correo electrónico incorrecto' : ''
      }));
    }

    if (name === 'password') {
      setErrors(prev => ({
        ...prev,
        password: value.length < 7 || value.length > 25 
          ? 'La contraseña debe tener entre 7 y 25 caracteres' 
          : ''
      }));
    }

    if (name === 'confirmPassword') {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value !== formData.password ? 'Las contraseñas deben ser iguales' : ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //TODO: Agregar lógica de registro
    console.log('Form submitted:', formData);
  };

  return (
    <>
    <div className="signup-container">
      <h1>Crear cuenta</h1>
      <form onSubmit={handleSubmit}>
        <div className="name-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
            required
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="submit-button">
          Crear cuenta
        </button>

        <p className="login-link">
          ¿Ya tienes una cuenta? <Link to= "/login"><a>Iniciar sesión</a></Link>
        </p>
      </form>
    </div>
    </>
  );
}

