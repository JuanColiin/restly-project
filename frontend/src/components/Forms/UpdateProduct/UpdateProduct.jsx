import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "../CreateProduct/PropertyForm.module.css";
import FeatureSelector from "../CreateProduct/FeatureSelector";

export default function UpdateProduct() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    street: "",
    number: "",
    country: "",
    state: "",
    city: "",
    description: "",
    shortDescription: "",
    category: {
      name: "",
      description: "",
    },
    policy: {
      cancellation: "",
      rules: "",
      security: "",
    },
    features: [],
    images: [],
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [categories, setCategories] = useState([]);

  const countryTranslations = {
    "United States": "Estados Unidos",
    Mexico: "México",
    Brazil: "Brasil",
    Canada: "Canadá",
    Argentina: "Argentina",
    Spain: "España",
    France: "Francia",
    Germany: "Alemania",
  };

  useEffect(() => {
    axios.get("https://countriesnow.space/api/v0.1/countries/states")
      .then((res) => {
        const translated = res.data.data.map((c) => ({
          ...c,
          name: countryTranslations[c.name] || c.name,
        }));
        setCountries(translated);
      }).catch(console.error);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8080/products/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData({
          title: data.title,
          street: data.address.street,
          number: data.address.number,
          country: data.address.city.state.country.name,
          state: data.address.city.state.name,
          city: data.address.city.name,
          description: data.description,
          shortDescription: data.shortDescription,
          category: data.category,
          policy: data.policy,
          features: data.features || [],
          images: data.images || [],
        });
        setSelectedFeatures(data.features.map(f => f.title));
      }).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (formData.country) {
      const c = countries.find((c) => c.name === formData.country);
      setStates(c?.states || []);
      setCities([]);
    }
  }, [formData.country, countries]);

  useEffect(() => {
    if (formData.state && formData.country) {
      axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", {
        country: formData.country,
        state: formData.state,
      }).then((res) => setCities(res.data.data || []))
        .catch(console.error);
    }
  }, [formData.state, formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, index, field) => {
    const updatedImages = [...formData.images];
    updatedImages[index][field] = e.target.value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const addImageInput = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { title: "", imageUrl: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Estás a punto de actualizar esta propiedad.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    });
  
    if (!result.isConfirmed) {
      return; // cancelar envío
    }
  
    const address = {
      street: formData.street,
      number: formData.number,
      city: {
        name: formData.city,
        state: {
          name: formData.state,
          country: { name: formData.country },
        },
      },
    };
  
    const dataToSend = {
      ...formData,
      address,
      features: selectedFeatures.map((title) => {
        const feature = features.find((f) => f.label === title);
        return {
          id: null,
          title,
          icon: feature ? feature.icon : "default-icon",
        };
      }),
    };
  
    try {
      await axios.put(`http://localhost:8080/products/${id}`, dataToSend, {
        headers: { "Content-Type": "application/json" },
      });
  
      Swal.fire({
        icon: "success",
        title: "¡Producto actualizado!",
        text: "Los cambios se guardaron correctamente.",
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo actualizar el producto.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un problema al actualizar el producto.",
      });
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <h1>Actualizar Propiedad</h1>
      </div>

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      <div className={styles.section}>
        <h2>Información Básica</h2>
        <div className={styles.inputGroup}>
          <label>Título</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label>Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label>Descripción corta</label>
          <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label>Categoría</label>
          <select
            value={formData.category.name}
            onChange={(e) => setFormData((prev) => ({
              ...prev,
              category: { ...prev.category, name: e.target.value },
            }))}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.addressSection}>
          <h3><FiMapPin /> Dirección</h3>
          <div className={styles.addressGrid}>
            <div className={styles.inputGroup}>
              <label>Calle</label>
              <input type="text" name="street" value={formData.street} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Número</label>
              <input type="text" name="number" value={formData.number} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>País</label>
              <select name="country" value={formData.country} onChange={handleChange} required>
                <option value="">Seleccionar país</option>
                {countries.map((c) => (
                  <option key={c.iso2} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Estado</label>
              <select name="state" value={formData.state} onChange={handleChange} required>
                <option value="">Seleccionar estado</option>
                {states.map((s) => (
                  <option key={s.state_code || s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Ciudad</label>
              <select name="city" value={formData.city} onChange={handleChange} required>
                <option value="">Seleccionar ciudad</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <FeatureSelector
          features={features}
          setFeatures={setFeatures}
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
        />

        <div className={styles.policySection}>
          <h3>Políticas</h3>
          <div className={styles.inputGroup}>
            <label>Cancelación</label>
            <textarea value={formData.policy.cancellation} onChange={(e) =>
              setFormData((prev) => ({ ...prev, policy: { ...prev.policy, cancellation: e.target.value } }))
            } required />
          </div>
          <div className={styles.inputGroup}>
            <label>Seguridad</label>
            <textarea value={formData.policy.security} onChange={(e) =>
              setFormData((prev) => ({ ...prev, policy: { ...prev.policy, security: e.target.value } }))
            } required />
          </div>
          <div className={styles.inputGroup}>
            <label>Reglas</label>
            <textarea value={formData.policy.rules} onChange={(e) =>
              setFormData((prev) => ({ ...prev, policy: { ...prev.policy, rules: e.target.value } }))
            } required />
          </div>
        </div>

        <div className={styles.imageSection}>
          <h3>Imágenes</h3>
          {formData.images.map((img, index) => (
            <div key={index} className={styles.imageInputGroup}>
              <input
                type="text"
                placeholder="Título"
                value={img.title}
                onChange={(e) => handleImageChange(e, index, "title")}
              />
              <input
                type="text"
                placeholder="URL de la imagen"
                value={img.imageUrl}
                onChange={(e) => handleImageChange(e, index, "imageUrl")}
              />
            </div>
          ))}
          <button type="button" className={styles.addImageButton} onClick={addImageInput}>
            Agregar imagen
          </button>
        </div>

        <div className={styles.submitButton}>
          <button type="submit">Actualizar propiedad</button>
        </div>
      </div>
    </form>
  );
}
