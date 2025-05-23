import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi'; // Icono del dropdown
import './DropDown.css';
import { Link } from 'react-router-dom';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="dropdown-btn" onClick={toggleDropdown}>
        Panel Administrador <FiChevronDown />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <Link to="/CreateProduct" > <button className="dropdown-item">Crear propiedad</button></Link>
          <Link to="/ProductList" > <button className="dropdown-item">Administrar Propiedades</button></Link>
          <Link to="/Categories" > <button className="dropdown-item">Crear categoría</button></Link>
          <Link to="/CategoriesList" > <button className="dropdown-item">Administrar Categorias</button></Link>
          <Link to="/CreateFeature" > <button className="dropdown-item">Crear Caracteristica</button></Link>
          <Link to="/FeatureList" > <button className="dropdown-item">Administrar Caracteristicas</button></Link>
          <Link to="/UserList" > <button className="dropdown-item">Administrar Usuarios</button></Link>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
