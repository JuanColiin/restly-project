import { useState } from "react";
import './Header.css'; // Verifica que esté correctamente importado

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  // Función para alternar la visibilidad del menú
  const toggleMenu = () => {
    setMenuVisible(prevState => !prevState); // Alternar el estado
  };

  return (
    <div className="header">
      <div className="header-left">
        <a href="/" className="logo">Restly</a>
        <p className="slogan">Comodidad en cada destino</p>
      </div>
      <div className="header-right">
        <button className="btn">Crear cuenta</button>
        <button className="btn">Iniciar sesión</button>
      </div>
      
      {/* Icono de hamburguesa visible solo en móviles */}
      <div className="hamburger" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Menú desplegable */}
      {menuVisible && (
        <nav className="mobile-menu">
          <ul>
            <li><a href="#">Crear cuenta</a></li>
            <li><a href="#">Iniciar sesión</a></li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Header;




