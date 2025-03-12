import { useEffect, useState } from "react";
import axios from "axios";
import * as MuiIcons from "@mui/icons-material"; // Importa todos los íconos dinámicamente
import styles from "./FeaturesSelector.module.css";

// Mapeo de iconos para características estáticas
const staticFeatures = {
  wifi: { label: "Wi-Fi", icon: <MuiIcons.Wifi className={styles.featureIcon} /> },
  pool: { label: "Piscina", icon: <MuiIcons.Pool className={styles.featureIcon} /> },
  parking: { label: "Parqueadero", icon: <MuiIcons.LocalParking className={styles.featureIcon} /> },
  restaurant: { label: "Restaurante", icon: <MuiIcons.Restaurant className={styles.featureIcon} /> },
  gym: { label: "Gimnasio", icon: <MuiIcons.FitnessCenter className={styles.featureIcon} /> },
  pets: { label: "Pet Friendly", icon: <MuiIcons.Pets className={styles.featureIcon} /> },
};

// Función para obtener el icono dinámicamente
const getIconComponent = (iconName) => {
  const IconComponent = MuiIcons[iconName]; // Busca el ícono en los imports de MUI
  return IconComponent ? <IconComponent className={styles.featureIcon} /> : <MuiIcons.HelpOutline className={styles.featureIcon} />;
};

const FeatureSelector = () => {
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/features")
      .then(response => {
        const fetchedFeatures = response.data;

        // Filtrar características nuevas que no están en las estáticas
        const newFeatures = fetchedFeatures.filter(feature => !staticFeatures[feature.title]);

        const formattedFeatures = newFeatures.map(feature => ({
          name: feature.title,
          label: feature.title,
          icon: getIconComponent(feature.icon), // Obtiene el icono dinámicamente
        }));

        setFeatures([...Object.values(staticFeatures), ...formattedFeatures]);
      })
      .catch(error => console.error("Error fetching features:", error));
  }, []);

  const handleCheckboxChange = (featureName) => {
    setSelectedFeatures(prevSelected =>
      prevSelected.includes(featureName)
        ? prevSelected.filter(name => name !== featureName)
        : [...prevSelected, featureName]
    );
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

export default FeatureSelector;
