import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import * as Icons from "@mui/icons-material";
import bookingIcons from "../../../utils/bookingicons";
import "./FeatureForm.css";


const uniqueIconOptions = Array.from(new Set(bookingIcons))
  .filter(icon => Icons[icon])
  .map(icon => ({ label: icon, component: Icons[icon] }));

const FeatureForm = ({ onSubmit = () => {} }) => { 
  const [feature, setFeature] = useState({ title: "", icon: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFeature({ ...feature, [e.target.name]: e.target.value });
  };

  const handleIconSelect = (icon) => {
    setFeature({ ...feature, icon });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feature.title.trim() || !feature.icon.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/features", feature);
      if (typeof onSubmit === "function") {
        onSubmit(response.data);
      }
      setFeature({ title: "", icon: "" });
      alert("Característica creada con éxito");
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al guardar la característica");
    } finally {
      setLoading(false);
    }
  };

  const filteredIcons = uniqueIconOptions.filter((icon) =>
    icon.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="feature-form-container">
      <h2 className="form-title">Crear Nueva Característica</h2>

      <form onSubmit={handleSubmit} className="feature-form">
        <div className="form-header">
          <div className="form-group">
            <label htmlFor="title">Nombre de la característica</label>
            <input
              type="text"
              id="title"
              name="title"
              value={feature.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="searchIcon">Buscar ícono</label>
            <input
              type="text"
              id="searchIcon"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre del ícono..."
            />
          </div>

          <div className="form-group">
            <label>Ícono seleccionado</label>
            <input type="text" value={feature.icon} readOnly />
          </div>

          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>

        <div className="icon-grid">
          {filteredIcons.map((option, index) => {
            const IconComponent = option.component;
            return (
              <div
                key={`${option.label}-${index}`} 
                className={`icon-item ${feature.icon === option.label ? "selected" : ""}`}
                onClick={() => handleIconSelect(option.label)}
              >
                <IconComponent className="icon-preview" />
                <span className="icon-label">{option.label}</span>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

FeatureForm.propTypes = {
  onSubmit: PropTypes.func,
};

export default FeatureForm;
