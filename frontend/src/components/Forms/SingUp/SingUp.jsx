import { useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./SingUp.css";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function SignUp() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        confirmPassword:
          formData.confirmPassword && value !== formData.confirmPassword
            ? "Las contraseñas deben ser iguales"
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
      const response = await axios.post(`${apiUrl}/auth/register`, registerData);

      const userData = {
        token: response.data.token,
        firstname: response.data.firstname,
        email: response.data.email,
        role: response.data.role,
        userId: response.data.userId,
      };

      login(userData);

      // Mostrar alerta de éxito
      Swal.fire({
        title: "Cuenta creada",
        text: "¡Tu cuenta ha sido creada exitosamente!",
        icon: "success",
        confirmButtonColor: "#00c98c",
        confirmButtonText: "Continuar",
      }).then(() => {
        navigate("/");
      });

    } catch (error) {
      if (error.response && error.response.status === 409) {
        setServerError("El correo electrónico ya está registrado.");
      } else {
        setServerError("Error en el registro. Inténtalo nuevamente.");
      }
    }
  };

  return (
    <div className="signup-form-container">
      <h1 className="form-title">Crear cuenta</h1>
      <form onSubmit={handleSubmit}>
        {serverError && <p className="server-error-message">{serverError}</p>}

        <div className="name-fields-row">
          <div className="form-field-group">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <div className="form-input-wrapper">
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="form-field-group">
            <label htmlFor="apellido" className="form-label">Apellido</label>
            <div className="form-input-wrapper">
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-field-group">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <div className="form-input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "has-error" : ""}`}
              required
            />
          </div>
          {errors.email && <span className="form-error-message">{errors.email}</span>}
        </div>

        <div className="form-field-group">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <div className="form-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? "has-error" : ""}`}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <span className="form-error-message">{errors.password}</span>}
        </div>

        <div className="form-field-group">
          <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
          <div className="form-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? "has-error" : ""}`}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="form-error-message">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="submit-form-btn">
          Crear cuenta
        </button>

        <p className="login-redirect">
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
}
