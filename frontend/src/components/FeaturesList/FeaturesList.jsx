import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Delete, Edit } from "@mui/icons-material";
import * as Icons from "@mui/icons-material";
import styles from "./FeaturesList.module.css";
import bookingIcons from "../../utils/bookingicons";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const FeaturesList = () => {
  const [features, setFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
      const token = storedUser?.token; // Extraer token

      const response = await axios.get(`${apiUrl}/features`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setFeatures(response.data);
    } catch (error) {
      console.error("Error al obtener características:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la característica de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c98c',
      cancelButtonColor: '#2b2c28',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
        const token = storedUser?.token; 

        await axios.delete(`${apiUrl}/features/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'La característica ha sido eliminada correctamente.',
          confirmButtonColor: '#00c98c',
        });
        fetchFeatures();
      } catch (error) {
        console.error("Error al eliminar característica:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al eliminar la característica.',
        });
      }
    }
  };

  const openModal = (feature) => {
    setSelectedFeature({ ...feature });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedFeature(null);
    setModalIsOpen(false);
  };

  const handleUpdate = async () => {
    if (!selectedFeature) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
      const token = storedUser?.token; // Extraer token

      await axios.put(`${apiUrl}/features/${selectedFeature.id}`, {
        title: selectedFeature.title,
        icon: selectedFeature.icon,
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Característica actualizada correctamente.',
        confirmButtonColor: '#00c98c',
      });
      fetchFeatures();
      closeModal();
    } catch (error) {
      console.error("Error al actualizar característica:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar la característica.',
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2>Listado de Características</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ícono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {features.length > 0 ? (
            features.map((feature) => (
              <tr key={feature.id}>
                <td>{feature.title}</td>
                <td>
                  {Icons[feature.icon] ? React.createElement(Icons[feature.icon]) : "No definido"}
                </td>
                <td>
                  <button className={styles.editButton} onClick={() => openModal(feature)}>
                    <Edit />
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(feature.id)}>
                    <Delete />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay características registradas</td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Editar Característica</h2>
        {selectedFeature && (
          <div className={styles.modalContent}>
            <label>Nombre:</label>
            <input
              type="text"
              value={selectedFeature.title}
              onChange={(e) =>
                setSelectedFeature((prev) => ({ ...prev, title: e.target.value }))
              }
            />

            <label>Selecciona un Ícono:</label>
            <div className={styles.iconGrid}>
              {bookingIcons.map((iconName, index) => (
                <div
                  key={`${iconName}-${index}`} 
                  className={`${styles.iconOption} ${
                    selectedFeature.icon === iconName ? styles.selected : ""
                  }`}
                  onClick={() =>
                    setSelectedFeature((prev) => ({ ...prev, icon: iconName }))
                  }
                >
                  {Icons[iconName] ? React.createElement(Icons[iconName]) : "❓"}
                </div>
              ))}
            </div>

            <label>Ícono seleccionado:</label>
            <input type="text" value={selectedFeature.icon} readOnly />

            <div className={styles.buttonGroup}>
              <button className={styles.saveButton} onClick={handleUpdate}>
                Guardar
              </button>
              <button className={styles.cancelButton} onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeaturesList;
