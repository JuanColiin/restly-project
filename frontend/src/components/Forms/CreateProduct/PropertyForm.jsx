import { useState, useEffect } from "react"
import { FiMapPin } from "react-icons/fi"

import axios from "axios"
import styles from "./PropertyForm.module.css"
import Swal from 'sweetalert2';
import FeatureSelector from "./FeatureSelector"

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function PropertyForm() {
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
    images: [
      { title: "", imageUrl: "" },
      { title: "", imageUrl: "" },
      { title: "", imageUrl: "" },
      { title: "", imageUrl: "" },
      { title: "", imageUrl: "" },
    ],
    whatsappNumber: "", 
  });


  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    axios
      .get("https://countriesnow.space/api/v0.1/countries/states")
      .then((response) => {
        setCountries(response.data.data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const [categories, setCategories] = useState([]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/categories`);
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("Error: La respuesta no es un array válido.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    if (formData.country) {
      const countryData = countries.find((country) => country.name === formData.country)
      if (countryData && Array.isArray(countryData.states)) {
        setStates(countryData.states)
      } else {
        setStates([])
      }
      setFormData((prev) => ({ ...prev, state: "", city: "" }))
      setCities([])
    } else {
      setStates([])
      setCities([])
    }
  }, [formData.country, countries])

  useEffect(() => {
    if (formData.state && formData.country) {
      axios
        .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
          country: formData.country,
          state: formData.state,
        })
        .then((response) => {
          setCities(response.data.data || [])
          setFormData((prev) => ({ ...prev, city: "" }))
        })
        .catch((error) => console.error("Error fetching cities for state:", error))
    } else {
      setCities([])
    }
  }, [formData.state, formData.country])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e, index) => {
    const updatedImages = [...formData.images]
    updatedImages[index].imageUrl = e.target.value
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }))
  }

  const addImageInput = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { title: "", imageUrl: "" }],
    }))
  }




  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const addressData = {
      street: formData.street,
      number: formData.number,
      city: {
        name: formData.city,
        state: {
          name: formData.state,
          country: {
            name: formData.country,
          },
        },
      },
    };

    console.log("Características seleccionadas:", selectedFeatures);
    const dataToSend = {
      ...formData,
      address: addressData,
      features: selectedFeatures.length > 0
        ? selectedFeatures.map(title => {
          const feature = features.find(f => f.label === title);
          return {
            id: null,
            title,
            icon: feature ? feature.icon : "default-icon"
          };
        })
        : []
    };

    console.log("Datos a enviar:", JSON.stringify(dataToSend, null, 2));


    try {
      const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
      const token = storedUser?.token; // Extraer token
  
      const response = await axios.post(
        `${apiUrl}/products/create`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Token correcto
          }
        }
      );
  
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Producto creado exitosamente.',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al crear el producto';
      setErrorMessage(errorMessage);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };





  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>

        <h1>Crear Nueva Propiedad</h1>
      </div>

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}


      <div className={styles.section}>
        <h2>Información Básica</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: Apartamento en el centro"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe la propiedad..."
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="shortDescription">Descripción corta</label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="Describe la propiedad de manera corta..."
            required
          />
        </div>

        
        <div className={styles.section}>
          <h2>Categorías</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="category">Seleccionar Categoría</label>
            <select
              id="category"
              name="category"
              value={formData.category.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: {
                    ...prev.category,
                    name: e.target.value,
                  },
                }))
              }
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div className={styles.addressSection}>
          <h3>
            <FiMapPin /> Dirección
          </h3>
          <div className={styles.addressGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="street">Calle</label>
              <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="number">Número</label>
              <input type="text" id="number" name="number" value={formData.number} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="country">País</label>
              <select id="country" name="country" value={formData.country} onChange={handleChange} required>
                <option value="">Seleccionar país</option>
                {countries.map((country) => (
                  <option key={country.iso2} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="state">Estado</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                disabled={!states.length}
              >
                <option value="">Seleccionar estado</option>
                {states.map((state) => (
                  <option key={state.state_code || state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="city">Ciudad</label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={!cities.length}
              >
                <option value="">Seleccionar ciudad</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Contacto</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="whatsappNumber">Número de WhatsApp</label>
            <input
              type="text"
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="Ej: +1234567890"
              required
            />
          </div>
        </div>

        <FeatureSelector
          features={features}
          setFeatures={setFeatures}
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
        />




        {/* Nueva sección de Políticas */}
        <div className={styles.policySection}>
          <h3>Políticas</h3>
          <div className={styles.inputGroup}>
            <label htmlFor="cancellation">Política de Cancelación</label>
            <textarea
              id="cancellation"
              name="cancellation"
              value={formData.policy.cancellation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  policy: { ...prev.policy, cancellation: e.target.value },
                }))
              }
              placeholder="Ej: Cancelación gratuita hasta 24 horas antes de la llegada."
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="security">Política de seguridad</label>
            <textarea
              id="security"
              name="security"
              value={formData.policy.payment}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  policy: { ...prev.policy, security: e.target.value },
                }))
              }
              placeholder="Ej: En caso de emergencia siga las indicaciones."
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="rules">Política de reglas</label>
            <textarea
              id="rules"
              name="rules"
              value={formData.policy.payment}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  policy: { ...prev.policy, rules: e.target.value },
                }))
              }
              placeholder="Ej: No se puede tener la musica con bastante volumen después de las 10 pm."
              required
            />
          </div>
        </div>

        {/* Sección de imágenes */}
        <div className={styles.imageSection}>
          <h3>Imágenes</h3>
          {formData.images.map((image, index) => (
            <div key={index} className={styles.imageInputGroup}>
              <input
                type="text"
                placeholder="Título de la imagen"
                value={image.title}
                onChange={(e) => {
                  const updatedImages = [...formData.images]
                  updatedImages[index].title = e.target.value
                  setFormData((prev) => ({
                    ...prev,
                    images: updatedImages,
                  }))
                }}
              />
              <input
                type="text"
                placeholder="URL de la imagen"
                value={image.imageUrl}
                onChange={(e) => handleImageChange(e, index)}
              />
            </div>
          ))}
          <button type="button" className={styles.addImageButton} onClick={addImageInput}>
            Agregar otra imagen
          </button>
        </div>



        <div className={styles.submitButton}>
          <button type="submit">Crear propiedad</button>
        </div>
      </div>
    </form>
  )
}

