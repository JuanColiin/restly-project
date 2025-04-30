import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./UserList.css";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [modifiedUsers, setModifiedUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiUrl}/users`)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar los usuarios");
        setLoading(false);
      });
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setModifiedUsers((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleSaveRole = async (userId) => {
    if (!modifiedUsers[userId]) return;

    try {
      await axios.put(
        `${apiUrl}/users/update-role/${userId}`,
        { role: modifiedUsers[userId] },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: modifiedUsers[userId] } : user
        )
      );

      setModifiedUsers((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });

      Swal.fire({
        icon: "success",
        title: "Rol actualizado",
        text: "El rol del usuario se actualizó correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el rol. Inténtalo de nuevo.",
      });
    }
  };

  if (loading) return <p className="user-list-loading">Cargando usuarios...</p>;
  if (error) return <p className="user-list-error">{error}</p>;

  return (
    <div className="user-list-container">
      <h2 className="user-list-title">Gestión de Usuarios</h2>
      <table className="user-list-table">
        <thead>
          <tr>
            <th className="user-list-th">Nombre</th>
            <th className="user-list-th">Email</th>
            <th className="user-list-th">Rol</th>
            <th className="user-list-th">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="user-list-tr">
              <td className="user-list-td">{`${user.firstname} ${user.lastname}`}</td>
              <td className="user-list-td">{user.email}</td>
              <td className="user-list-td">
                <select
                  className="user-list-select"
                  value={modifiedUsers[user.id] || user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td className="user-list-td">
                {modifiedUsers[user.id] && (
                  <button
                    className="user-list-save-btn"
                    onClick={() => handleSaveRole(user.id)}
                  >
                    Guardar Cambios
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
