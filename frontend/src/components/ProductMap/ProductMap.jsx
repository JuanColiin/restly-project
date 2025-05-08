import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ProductMap.css'; // Importa los estilos mejorados

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const ProductMap = ({ address }) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  const fullAddress = address
    ? `${address.street} ${address.number}, ${address.city.name}, ${address.city.state.name}, ${address.city.state.country.name}`
    : '';

  useEffect(() => {
    const fetchCoordinates = async (query) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        if (data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setError(null);
        } else {
          const fallbackQuery = `${address.city.name}, ${address.city.state.country.name}`;
          const fallbackResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackQuery)}`
          );
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.length > 0) {
            setPosition([parseFloat(fallbackData[0].lat), parseFloat(fallbackData[0].lon)]);
            setError('Dirección exacta no encontrada. Mostrando ubicación aproximada.');
          } else {
            setError('No se pudo encontrar la ubicación.');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Error al obtener coordenadas.');
      }
    };

    if (fullAddress) {
      fetchCoordinates(fullAddress);
    }
  }, [
    fullAddress,
    address.city.name,
    address.city.state.name,
    address.city.state.country.name
  ]);

  return (
    <div className="map-wrapper">
      {position ? (
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={false}
          className="leaflet-container-custom"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}@2x.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />
          <Marker position={position} icon={markerIcon}>
            <Popup>
              {address.street} {address.number}<br />
              {address.city.name}, {address.city.state.name}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="map-loading-message">
          {error || 'Cargando mapa...'}
        </div>
      )}
    </div>
  );
};

ProductMap.propTypes = {
  address: PropTypes.shape({
    street: PropTypes.string.isRequired,
    number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    city: PropTypes.shape({
      name: PropTypes.string.isRequired,
      state: PropTypes.shape({
        name: PropTypes.string.isRequired,
        country: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default ProductMap;
