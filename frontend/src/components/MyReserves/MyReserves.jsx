import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './MyReserves.css';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Swal from 'sweetalert2';

const MyReserves = () => {
  const { user } = useAuth();
  const [reserves, setReserves] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [extendingReserveId, setExtendingReserveId] = useState(null);
  const [newCheckOut, setNewCheckOut] = useState(null);
  const [extensionSuccess, setExtensionSuccess] = useState(null);
  const [extensionError, setExtensionError] = useState(null);
  const [isExtending, setIsExtending] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.userId) {
          setLoading(false);
          setError('Usuario no autenticado');
          return;
        }

        const reservesResponse = await axios.get(
          `http://localhost:8080/reserves/user/${user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        if (!reservesResponse.data || !Array.isArray(reservesResponse.data)) {
          throw new Error('Formato de reservas inválido');
        }

        const productPromises = reservesResponse.data.map(reserve => 
          axios.get(`http://localhost:8080/products/${reserve.productId}`, {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          })
        );

        const productsResponse = await Promise.all(productPromises);
        const productsData = {};
        
        productsResponse.forEach((response, index) => {
          productsData[reservesResponse.data[index].productId] = response.data;
        });

        setProducts(productsData);
        setReserves(reservesResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleExtendReserve = (reserveId, currentCheckOut) => {
    setExtendingReserveId(reserveId);
    const minDate = new Date(currentCheckOut);
    minDate.setDate(minDate.getDate() + 1);
    setNewCheckOut(minDate);
  };

  const cancelExtension = () => {
    setExtendingReserveId(null);
    setNewCheckOut(null);
    setExtensionError(null);
  };

  const confirmExtension = async () => {
    if (!newCheckOut) {
      setExtensionError('Selecciona una fecha válida');
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas extender la reserva hasta el ${newCheckOut.toLocaleDateString()}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c98c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, extender',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsExtending(true);
    setExtensionError(null);

    try {
      const adjustedDate = new Date(newCheckOut);
      adjustedDate.setDate(adjustedDate.getDate() - 1);

      const formattedDate = adjustedDate.toISOString().split('T')[0];

      const response = await axios.put(
        `http://localhost:8080/reserves/${extendingReserveId}/extend`,
        null,
        {
          params: {
            newCheckOut: formattedDate
          },
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      const updatedCheckOut = response.data.checkOut || formattedDate;

      setReserves(reserves.map(reserve => 
        reserve.id === extendingReserveId 
          ? { ...reserve, checkOut: updatedCheckOut } 
          : reserve
      ));

      Swal.fire({
        icon: 'success',
        title: '¡Extensión exitosa!',
        text: `Reserva extendida hasta el ${new Date(updatedCheckOut).toLocaleDateString()}`,
        confirmButtonColor: '#00c98c',
      });

      setExtensionSuccess(`Reserva extendida hasta el ${new Date(updatedCheckOut).toLocaleDateString()}`);
      setTimeout(() => setExtensionSuccess(null), 5000);
      setExtendingReserveId(null);
      setNewCheckOut(null);
    } catch (err) {
      console.error('Error extending reservation:', err);
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         'Error al extender la reserva';

      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: errorMessage,
        confirmButtonColor: '#00c98c',
      });

      setExtensionError(errorMessage);
      setTimeout(() => setExtensionError(null), 5000);
    } finally {
      setIsExtending(false);
    }
  };

  const formatLocation = (product) => {
    if (!product?.address?.city) return 'Ubicación no especificada';

    const city = product.address.city.name || '';
    const state = product.address.city.state?.name || '';
    const country = product.address.city.state?.country?.name || '';

    return `${city}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;
  };

  const renderCalendar = () => {
    const currentMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const monthName = currentMonth.toLocaleString("es-ES", { month: "long" });
    const year = currentMonth.getFullYear();

    const days = Array.from({ length: firstDay }, (_, i) => (
      <div key={`empty-${i}`} className="ca-calendar-day ca-empty"></div>
    ));

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      date.setHours(0, 0, 0, 0);

      const isDisabled = date <= new Date();
      const isSelected = newCheckOut && date.getTime() === newCheckOut.getTime();

      days.push(
        <div
          key={date.toISOString()}
          className={`ca-calendar-day ${isSelected ? "ca-selected" : ""} ${isDisabled ? "ca-disabled" : ""}`}
          onClick={() => !isDisabled && setNewCheckOut(date)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="ca-calendar">
        <div className="ca-calendar-header">
          <button 
            className="ca-nav-button" 
            onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() - 1)))}
          >
            <FaChevronLeft />
          </button>
          <h3>{monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}</h3>
          <button 
            className="ca-nav-button" 
            onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() + 1)))}
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="ca-calendar-weekdays">
          {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="ca-calendar-days">{days}</div>
      </div>
    );
  };

  if (loading) return <div className="ca-loading">Cargando reservas...</div>;
  if (error) return (
    <div className="ca-error-message">
      {error}
      <button onClick={() => window.location.reload()}>Reintentar</button>
    </div>
  );

  return (
    <div className="my-reserves-container">
      <h2>Mis Reservas</h2>

      {extensionSuccess && (
        <div className="alert alert-success">
          <p>{extensionSuccess}</p>
        </div>
      )}

      {extensionError && (
        <div className="alert alert-error">
          <p>{extensionError}</p>
          <button onClick={() => setExtensionError(null)}>Cerrar</button>
        </div>
      )}

      {reserves.length === 0 ? (
        <p>No tienes reservas actualmente</p>
      ) : (
        <div className="reserves-list">
          <table className="reserves-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
  {reserves.map(reserve => {
    const product = products[reserve.productId] || {};
    const currentCheckOut = new Date(reserve.checkOut);

    return (
      <tr key={reserve.id} className="reserve-item">
        <td data-label="Producto">
          <div className="product-info">
            {product.images?.[0]?.imageUrl && (
              <img 
                src={product.images[0].imageUrl} 
                alt={product.title || 'Imagen del producto'} 
                className="product-thumbnail"
              />
            )}
            <div className="product-title">{product.title || 'Producto sin título'}</div>
          </div>
        </td>
        <td data-label="Check-in">{new Date(reserve.checkIn).toLocaleDateString()}</td>
        <td data-label="Check-out">{currentCheckOut.toLocaleDateString()}</td>
        <td data-label="Ubicación">{formatLocation(product)}</td>
        <td data-label="Acciones">
          <button 
            className="ca-reserve-btn"
            onClick={() => handleExtendReserve(reserve.id, reserve.checkOut)}
            disabled={isExtending}
          >
            {isExtending && extendingReserveId === reserve.id ? 'Procesando...' : 'Extender'}
          </button>
        </td>
      </tr>
    );
  })}
</tbody>
          </table>

          {extendingReserveId && (
            <div className="modal-overlay">
              <div className="modal-box">
                <div className="calendar-container">
                  <h3>Extender reserva hasta:</h3>
                  <p className="info-text">
                    Selecciona el día de tu última noche. El check-out será en la mañana del día siguiente.
                  </p>
                  <div className="ca-calendars-container">
                    {renderCalendar()}
                  </div>
                  <div className="confirm-reservation-box">
                    <div className="ca-selected-dates-summary">
                      {newCheckOut && (
                        <>
                          <p><strong>Última noche:</strong> {newCheckOut.toLocaleDateString()}</p>
                          <p><strong>Check-out:</strong> {new Date(newCheckOut.getTime() + 86400000).toLocaleDateString()}</p>
                        </>
                      )}
                    </div>
                    <div className="modal-buttons">
                      <button 
                        className="confirm-btn" 
                        onClick={cancelExtension}
                        disabled={isExtending}
                      >
                        Cancelar
                      </button>
                      <button 
                        className="confirm-btn" 
                        onClick={confirmExtension}
                        disabled={!newCheckOut || isExtending}
                      >
                        {isExtending ? 'Confirmando...' : 'Confirmar Extensión'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyReserves;