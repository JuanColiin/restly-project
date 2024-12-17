import { useState } from "react";
import './Header.css'; 
import { Link } from "react-router-dom";

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(prevState => !prevState); 
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

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
        <nav className="mobile-menu">
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

