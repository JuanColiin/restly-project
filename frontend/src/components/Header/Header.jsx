import { useState, useEffect, useRef, useContext } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Dropdown from "./DropDown";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768); // Detectar si es escritorio
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Función para actualizar la variable isDesktop en base al tamaño de la pantalla
  const updateScreenSize = () => {
    setIsDesktop(window.innerWidth > 768);
  };

  useEffect(() => {
    window.addEventListener("resize", updateScreenSize);
    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const getInitials = (name, email) => {
    if (name) {
      const nameParts = name.trim().split(" ");
      return nameParts.length > 1
        ? nameParts[0][0] + nameParts[1][0]
        : nameParts[0][0];
    }
    return email ? email[0].toUpperCase() : "U";
  };

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
    closeDropdown();
  };

  const handleProfileClick = (event) => {
    event.preventDefault();
    closeDropdown();
    navigate("/profile");
  };

  // Función para evitar que se cierre el dropdown al hacer clic en las opciones dentro de él
  const preventDropdownClose = (event) => {
    event.stopPropagation(); // Evita que el evento se propague y cierre el dropdown
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">Restly</Link>
        <span className="slogan">Comodidad en cada destino</span>
      </div>

      <div className="header-right">
        {user ? (
          <>
            <div className="user-info">
              {/* Dropdown solo aparece en versión de escritorio y si el rol es ADMIN */}
              {isDesktop && user.role === "ADMIN" && (
                <div className="admin-dropdown">
                  <Dropdown />
                </div>
              )}
              <div className="avatar" onClick={toggleDropdown}>
                {getInitials(user?.firstname, user?.email)}
              </div>
              {isDropdownOpen && (
                <div className="profile-dropdown show" ref={profileRef}>
                  <button className="close-profile" onClick={closeDropdown}>×</button>
                  <div className="profile-avatar">
                    {getInitials(user?.firstname, user?.email)}
                  </div>
                  <div className="profile-welcome">Bienvenido, {user?.firstname || user?.email}</div>
                  <div className="profile-email">{user?.email}</div>
                  <Link
                    to="/profile"
                    className="profile-option"
                    onClick={(e) => { handleProfileClick(e); preventDropdownClose(e); }}
                  >
                    Perfil
                  </Link>
                  <Link
                    to="/FavoritesList"
                    className="profile-option"
                    onClick={preventDropdownClose} // Evitar que se cierre el dropdown
                  >
                    Mis favoritos
                  </Link>
                  <Link
                    to="/MyReserves"
                    className="profile-option"
                    onClick={preventDropdownClose} // Evitar que se cierre el dropdown
                  >
                    Mis Reservas
                  </Link>
                  <Link
                    to="#"
                    className="profile-option"
                    onClick={(e) => { handleLogout(e); preventDropdownClose(e); }}
                  >
                    Cerrar sesión
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/singup"><button className="btn">Crear cuenta</button></Link>
            <Link to="/login"><button className="btn">Iniciar sesión</button></Link>
          </>
        )}
      </div>

      {!user && (
        <div className="hamburger" onClick={toggleMobileMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="mobile-menu" ref={menuRef}>
          <ul>
            <Link to="/singup" onClick={closeMenu}><li>Crear cuenta</li></Link>
            <Link to="/login" onClick={closeMenu}><li>Iniciar sesión</li></Link>
          </ul>
        </div>
      )}

      {user && (
        <div className="mobile-avatar">
          <div className="avatar" onClick={toggleDropdown}>
            {getInitials(user?.firstname, user?.email)}
          </div>
          {isDropdownOpen && (
            <div className="profile-dropdown show" ref={profileRef}>
              <button className="close-profile" onClick={closeDropdown}>×</button>
              <div className="profile-avatar">
                {getInitials(user?.firstname, user?.email)}
              </div>
              <div className="profile-welcome">Bienvenido, {user?.firstname || user?.email}</div>
              <Link
                to="/profile"
                className="profile-option"
                onClick={(e) => { handleProfileClick(e); preventDropdownClose(e); }}
              >
                Perfil
              </Link>
              <Link
                to="/FavoritesList"
                className="profile-option"
                onClick={preventDropdownClose} // Evitar que se cierre el dropdown
              >
                Mis favoritos
              </Link>
              <Link
                to="/MyReserves"
                className="profile-option"
                onClick={preventDropdownClose} // Evitar que se cierre el dropdown
              >
                Mis Reservas
              </Link>
              <Link
                to="#"
                className="profile-option"
                onClick={(e) => { handleLogout(e); preventDropdownClose(e); }}
              >
                Cerrar sesión
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
