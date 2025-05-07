import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData, rememberMe = false) => {
    const { token, firstname, email, role, userId } = userData;
    const user = { token, firstname, email, role, userId };

    setUser(user);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(user));
    // Limpia el otro storage para evitar conflictos
    if (rememberMe) sessionStorage.removeItem('user');
    else localStorage.removeItem('user');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser =
      JSON.parse(sessionStorage.getItem('user')) ||
      JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
