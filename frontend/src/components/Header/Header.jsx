import { useState, useEffect, useRef, useContext } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Dropdown from "./DropDown";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const { user, logout } = useContext(AuthContext);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitials = (name, email) => {
    if (name) {
      const nameParts = name.trim().split(" ");
      return nameParts.length > 1
        ? nameParts[0][0] + nameParts[1][0]
        : nameParts[0][0];
    }
    return email ? email[0].toUpperCase() : "U";
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">Restly</Link>
        <span className="slogan">Comodidad en cada destino</span>
      </div>
      <div className="header-right">
        {user ? (
          <div className="user-info">
            <div className="avatar" onClick={toggleDropdown}>
              {getInitials(user?.firstname, user?.email)}
            </div>
            {isDropdownOpen && (
              <div className="profile-dropdown show" ref={profileRef}>
                <button className="close-profile" onClick={toggleDropdown}>×</button>
                <div className="profile-avatar">
                  {getInitials(user?.firstname, user?.email)}
                </div>
                <div className="profile-welcome">Bienvenido, {user?.firstname || user?.email}</div>
                <div className="profile-email">{user?.email}</div>
                <Link to="/profile" className="profile-option">Perfil</Link>
                <Link to="#" className="profile-option" onClick={logout}>Cerrar sesión</Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <Dropdown />
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
        <div className="mobile-avatar" onClick={toggleDropdown}>
          <div className="avatar">
            {getInitials(user?.firstname, user?.email)}
          </div>
          {isDropdownOpen && (
            <div className="profile-dropdown show" ref={profileRef}>
              <button className="close-profile" onClick={toggleDropdown}>×</button>
              <div className="profile-avatar">
                {getInitials(user?.firstname, user?.email)}
              </div>
              <div className="profile-welcome">Bienvenido, {user?.firstname || user?.email}</div>
              <div className="profile-email">{user?.email}</div>
              <Link to="/profile" className="profile-option">Perfil</Link>
              <Link to="#" className="profile-option" onClick={logout}>Cerrar sesión</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
