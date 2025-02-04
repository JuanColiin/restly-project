import { useState, useEffect, useRef, useContext } from "react";
import './Header.css'; 
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";  // Importa el contexto
import Dropdown from "./DropDown";

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setMenuVisible((prevState) => !prevState); 
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
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
        {user ? (
          <div className="user-info">
            <span>Bienvenido, {user?.firstname || user?.email}</span> {/* Prioriza mostrar el firstname */}
            <button className="btn" onClick={logout}>Cerrar sesión</button>
          </div>
        ) : (
          <> 

          <Dropdown />
            <Link to="/singup"><button className="btn">Crear cuenta</button></Link> 
            <Link to="/login"><button className="btn">Iniciar sesión</button></Link>
          </>
        )}
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {menuVisible && (
        <nav className="mobile-menu" ref={menuRef}>
          <ul>
            <Link to="/singup" onClick={closeMenu}><li>Crear cuenta</li></Link>
            <Link to="/login" onClick={closeMenu}><li>Iniciar sesión</li></Link>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Header;



