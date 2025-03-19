import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import * as MuiIcons from "@mui/icons-material"; 
import styles from "./FeaturesSelector.module.css";


const getIconComponent = (iconName) => {
  const IconComponent = MuiIcons[iconName];
  return IconComponent ? <IconComponent className={styles.featureIcon} /> : <MuiIcons.HelpOutline className={styles.featureIcon} />;
};

const FeatureSelector = ({ selectedFeatures, setSelectedFeatures }) => {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/features")
      .then(response => {
        const formattedFeatures = response.data.map(feature => ({
          name: feature.title,
          label: feature.title,
          icon: getIconComponent(feature.icon), // Obtiene el ícono dinámicamente
        }));

        setFeatures(formattedFeatures);
      })
      .catch(error => console.error("Error fetching features:", error));
  }, []);

  const handleCheckboxChange = (featureLabel) => {
    setSelectedFeatures(prevSelected => {
      const updatedFeatures = prevSelected.includes(featureLabel)
        ? prevSelected.filter(name => name !== featureLabel)
        : [...prevSelected, featureLabel];

      console.log("Características seleccionadas actualizadas:", updatedFeatures);
      return updatedFeatures;
    });
  };

  return (
    <>
      <h2>Selecciona las características</h2>
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

// Validación de props
FeatureSelector.propTypes = {
  selectedFeatures: PropTypes.array.isRequired,
  setSelectedFeatures: PropTypes.func.isRequired,
};

export default FeatureSelector;
