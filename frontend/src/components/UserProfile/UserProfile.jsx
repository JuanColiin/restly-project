import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import "./UserProfile.css";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function UserProfile() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.userId) {
      axios.get(`${apiUrl}/users/${user.userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener el perfil:", err);
        setError("No se pudo cargar la información del usuario.");
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>{error}</p>;

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.trim().split(" ");
    const initials =
      nameParts.length > 1
        ? nameParts[0][0] + nameParts[1][0] 
        : nameParts[0][0]; 
    return initials.toUpperCase();
  };

  return (
    <div className="user-profile-container">
      <div className="user-avatar">{getInitials(userData.firstname)}</div>
      <h2 className="user-name">{userData.firstname} {userData.lastname}</h2>
      <p className="user-email">{userData.email}</p>
      <p className="user-role">Rol: {userData.role}</p>
    </div>
  );
}
