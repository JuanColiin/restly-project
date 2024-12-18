import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importar PropTypes

// Creamos el contexto de autenticación
const AuthContext = createContext();

// Proveedor de contexto para envolver tu aplicación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para guardar el token y los datos del usuario en el localStorage
  const login = (userData) => {
    const { token, firstname, email, role, userId } = userData;

    // Organiza los datos que guardarás en el estado y localStorage
    const user = { token, firstname, email, role, userId };

    setUser(user); // Actualiza el estado
    localStorage.setItem('user', JSON.stringify(user)); // Guarda en el localStorage
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Elimina del localStorage
  };

  // Verificar si hay un usuario en el localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Validación de props para `AuthProvider`
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validar que `children` es un nodo de React
};

// Exportamos el contexto para que los componentes puedan usarlo
export default AuthContext;


