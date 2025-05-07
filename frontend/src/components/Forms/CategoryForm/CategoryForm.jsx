import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./CategoryForm.css";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const CategoryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
      const token = storedUser?.token;

      await axios.post(`${apiUrl}/categories`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Categoría creada exitosamente.',
        confirmButtonColor: '#00c98c',
      });
      setMessage("Categoría creada exitosamente");
      setFormData({ name: "", description: "", imageUrl: "" });
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            setMessage(error.response.data.error);
          } else {
            setMessage("Error al crear la categoría");
          }                   
    }
  };
  
   
  return (
    <div className="category-form-container">
      <h2>Crear Categoría</h2>
      {message && <p className="category-form-message">{message}</p>}
      <form className="category-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre de la categoría</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="description">Descripción de la categoría</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <label htmlFor="imageUrl">URL de la imagen de la categoría</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />
        <button type="submit">Crear Categoría</button>
      </form>
    </div>
  );
}  

export default CategoryForm;
