import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./CategoryList.css";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: ""
  });

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchCategories = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
      const token = storedUser?.token; 

      const response = await axios.get(`${apiUrl}/categories`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = response.data;

      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.warn("La respuesta de /categories no es un array:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id, name) => {
    const result = await Swal.fire({
      title: `¿Eliminar la categoría "${name}"?`,
      text: `Esta acción eliminará todos los productos asociados a "${name}". ¿Estás seguro?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#339989",
      cancelButtonColor: "#2B2C28",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
        const token = storedUser?.token;

        await axios.delete(`${apiUrl}/categories/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        Swal.fire("Eliminado", `La categoría "${name}" fue eliminada.`, "success");
        fetchCategories();
      } catch {
        Swal.fire("Error", "No se pudo eliminar la categoría.", "error");
      }
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl
    });
  };

  const handleUpdate = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
      const token = storedUser?.token; // Extraer token

      await axios.put(`${apiUrl}/categories/${editingCategory.id}`, {
        id: editingCategory.id,
        ...formData
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      Swal.fire("Actualizado", "La categoría fue actualizada con éxito.", "success");
      setEditingCategory(null);
      fetchCategories();
    } catch {
      Swal.fire("Error", "No se pudo actualizar la categoría.", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-list-container">
      <h2>Categorías registradas</h2>

      {loading && <p>Cargando categorías...</p>}
      {!loading && error && <p style={{ color: "red" }}>No se pudieron cargar las categorías.</p>}
      {!loading && !error && categories.length === 0 && (
        <p>No hay categorías registradas.</p>
      )}

      {!loading && !error && categories.length > 0 && (
        <table className="category-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Imagen</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td><img src={cat.imageUrl} alt={cat.name} width="60" /></td>
                <td>{cat.totalProducts}</td>
                <td >
                  <button className="edit-btn" onClick={() => handleEditClick(cat)}>Editar</button>
                  <button className="delete-btn" onClick={() => deleteCategory(cat.id, cat.name)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL DE ACTUALIZACIÓN */}
      {editingCategory && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Categoría</h3>
            <label>Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <label>Descripción</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            <label>URL de imagen</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <div className="buttonGroup">
              <button className="saveButton" onClick={handleUpdate}>Guardar</button>
              <button className="cancelButton" onClick={() => setEditingCategory(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
