import { useState } from "react";
import axios from "axios";
import "./CategoryForm.css";

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
      await axios.post("http://localhost:8080/categories", formData);
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
