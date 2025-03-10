import { useEffect, useState } from "react";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Evita actualizaciones en componentes desmontados
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No se encontró un token de autenticación.");
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted) {
          setUser(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
        if (isMounted) {
          if (error.response) {
            console.error("Detalles del error:", error.response.data);
            if (error.response.status === 403) {
              setError("No tienes permiso para acceder a este perfil.");
            } else if (error.response.status === 401) {
              setError("Tu sesión ha expirado. Inicia sesión nuevamente.");
            } else {
              setError("Hubo un problema al cargar el perfil.");
            }
          } else {
            setError("Error de conexión con el servidor.");
          }
          setLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false; // Cleanup para evitar actualizaciones en componentes desmontados
    };
  }, []);

  if (loading) {
    return <div className="loading">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.firstname?.charAt(0) || "?"}
          {user?.lastname?.charAt(0) || "?"}
        </div>
        <h2 className="profile-name">
          {user?.firstname || "Usuario"} {user?.lastname || ""}
        </h2>
        <p className="profile-email">{user?.email || "Correo no disponible"}</p>
      </div>
    </div>
  );
};

export default UserProfile;
