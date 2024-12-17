import { useState, useEffect, useRef } from "react";
import './Header.css'; 
import { Link } from "react-router-dom";

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null); // Referencia al menú

  const toggleMenu = () => {
    setMenuVisible(prevState => !prevState); 
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  // Detecta clics fuera del menú para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };

    // Escucha el evento de clic
    document.addEventListener("mousedown", handleClickOutside);

    // Limpia el evento al desmontar
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className="header-left">
        <a href="/" className="logo">Restly</a>
        <p className="slogan">Comodidad en cada destino</p>
      </div>
      <div className="header-right">
        <Link to="singup"><button className="btn">Crear cuenta</button></Link> 
        <Link to="login"><button className="btn">Iniciar sesión</button></Link> 
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {menuVisible && (
        <nav className="mobile-menu" ref={menuRef}>
          <ul>
            <Link to="singup" onClick={closeMenu}><li>Crear cuenta</li></Link>
            <Link to="login" onClick={closeMenu}><li>Iniciar sesión</li></Link>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Header;
