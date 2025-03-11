import { useState, useContext } from "react";
import axios from "axios";
import "./SingUp.css";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";

export default function SignUp() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [serverError, setServerError] = useState(""); 

  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: !validateEmail(value) ? "Correo electrónico incorrecto" : "",
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password:
          value.length < 7 || value.length > 25
            ? "La contraseña debe tener entre 7 y 25 caracteres"
            : "",
      }));
    }

    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value !== formData.password ? "Las contraseñas deben ser iguales" : "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); 

    if (errors.email || errors.password || errors.confirmPassword) {
      return;
    }

    const registerData = {
      firstname: formData.nombre,
      lastname: formData.apellido,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        registerData
      );

      const userData = {
        token: response.data.token,
        firstname: response.data.firstname,
        email: response.data.email,
        role: response.data.role,
        userId: response.data.userId,
      };

      login(userData);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setServerError("El correo electrónico ya está registrado.");
      } else {
        setServerError("Error en el registro. Inténtalo nuevamente.");
      }
    }
  };

  return (
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
            className={errors.email ? "error" : ""}
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
            className={errors.password ? "error" : ""}
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
            className={errors.confirmPassword ? "error" : ""}
            required
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        {/* Mensaje de error del backend */}
        {serverError && <p className="error-message">{serverError}</p>}

        <button type="submit" className="submit-button">
          Crear cuenta
        </button>

        <p className="login-link">
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
}
