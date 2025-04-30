import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import * as MuiIcons from "@mui/icons-material";
import styles from "./FeaturesSelector.module.css";

const getIconComponent = (iconName) => {
  const IconComponent = MuiIcons[iconName];
  return IconComponent ? (
    <IconComponent className={styles.featureIcon} />
  ) : (
    <MuiIcons.HelpOutline className={styles.featureIcon} />
  );
};

const FeatureSelector = ({ selectedFeatures, setSelectedFeatures }) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get(`${apiUrl}/features`);

        if (Array.isArray(response.data)) {
          const formattedFeatures = response.data.map((feature) => ({
            name: feature.title,
            label: feature.title,
            icon: getIconComponent(feature.icon),
          }));
          setFeatures(formattedFeatures);
        } else {
          setFeatures([]);
          console.warn("La respuesta de /features no es un array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching features:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const handleCheckboxChange = (featureLabel) => {
    setSelectedFeatures((prevSelected) => {
      const updatedFeatures = prevSelected.includes(featureLabel)
        ? prevSelected.filter((name) => name !== featureLabel)
        : [...prevSelected, featureLabel];

      console.log("Características seleccionadas actualizadas:", updatedFeatures);
      return updatedFeatures;
    });
  };

  return (
    <>
      <h2>Selecciona las características</h2>

      {loading && <p>Cargando características...</p>}
      {!loading && error && <p style={{ color: "red" }}>No se pudieron cargar las características.</p>}
      {!loading && !error && features.length === 0 && (
        <p>No hay características disponibles.</p>
      )}

      <div className={styles.featureSelector}>
        {features.map((feature, index) => (
          <label key={index} className={styles.featureItem}>
            <input
              type="checkbox"
              checked={selectedFeatures.includes(feature.label)}
              onChange={() => handleCheckboxChange(feature.label)}
            />
            {feature.icon}
            <span>{feature.label}</span>
          </label>
        ))}
      </div>
    </>
  );
};

FeatureSelector.propTypes = {
  selectedFeatures: PropTypes.array.isRequired,
  setSelectedFeatures: PropTypes.func.isRequired,
};

export default FeatureSelector;
