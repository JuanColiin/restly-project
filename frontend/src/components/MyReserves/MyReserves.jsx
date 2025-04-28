import { useState, useEffect, useMemo } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './MyReserves.css';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";
import Swal from 'sweetalert2';

const MyReserves = () => {
  const { user } = useAuth();
  const [reserves, setReserves] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [extendingReserveId, setExtendingReserveId] = useState(null);
  const [newCheckOut, setNewCheckOut] = useState(null);
  const [minSelectableDate, setMinSelectableDate] = useState(new Date());
  const [extensionSuccess, setExtensionSuccess] = useState(null);
  const [extensionError, setExtensionError] = useState(null);
  const [isExtending, setIsExtending] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const parseDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Ordenar reservas por fecha de check-out descendente
  const sortedReserves = useMemo(() => {
    return [...reserves].sort((a, b) => {
      return parseDate(b.checkOut) - parseDate(a.checkOut);
    });
  }, [reserves]);

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

  const handleExtendReserve = (reserveId, checkOut) => {
    const parsedCheckOut = parseDate(checkOut);
    const minDate = new Date(parsedCheckOut);
    minDate.setDate(minDate.getDate() + 1);

    setExtendingReserveId(reserveId);
    setNewCheckOut(minDate);
    setMinSelectableDate(minDate);
    setCalendarDate(minDate);
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

    if (!result.isConfirmed) return;

    setIsExtending(true);
    setExtensionError(null);

    try {
      const formattedDate = newCheckOut.toISOString().split('T')[0];

      const response = await axios.put(
        `http://localhost:8080/reserves/${extendingReserveId}/extend`,
        null,
        {
          params: { newCheckOut: formattedDate },
          headers: { Authorization: `Bearer ${user.token}` }
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
        text: `Reserva extendida hasta el ${parseDate(updatedCheckOut).toLocaleDateString()}`,
        confirmButtonColor: '#00c98c',
      });

      setExtensionSuccess(`Reserva extendida hasta el ${parseDate(updatedCheckOut).toLocaleDateString()}`);
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

  const getReservationStatus = (checkOut) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkOutDate = parseDate(checkOut);
    
    if (checkOutDate < today) return 'finalizada';
    if (checkOutDate.toDateString() === today.toDateString()) return 'en curso';
    return 'próxima';
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

      const isDisabled = date < minSelectableDate;
      const isSelected = newCheckOut && date.getTime() === newCheckOut.getTime();

      days.push(
        <div
          key={date.toISOString()}
          className={`ca-calendar-day ${isSelected ? "ca-selected" : ""} ${isDisabled ? "ca-disabled" : ""}`}
          onClick={() => !isDisabled && setNewCheckOut(date)}
          aria-label={`Día ${day}${isSelected ? ', seleccionado' : ''}${isDisabled ? ', no disponible' : ''}`}
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
            aria-label="Mes anterior"
          >
            <FaChevronLeft />
          </button>
          <h3>{monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}</h3>
          <button
            className="ca-nav-button"
            onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() + 1)))}
            aria-label="Próximo mes"
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

  if (loading) return (
    <div className="my-reserves-container">
      <div className="loading-state">
        <div className="ca-loading">Cargando tus reservas...</div>
        <div className="loading-animation"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="my-reserves-container">
      <div className="error-state">
        <div className="ca-error-message">
          <FaInfoCircle className="error-icon" />
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="my-reserves-container">
      <header className="reserves-header">
        <h2>Mis Reservas</h2>
        <p className="reserves-subtitle">Historial completo de tus reservas</p>
      </header>

      {extensionSuccess && (
        <div className="alert alert-success">
          <p>{extensionSuccess}</p>
          <button onClick={() => setExtensionSuccess(null)} aria-label="Cerrar notificación">
            &times;
          </button>
        </div>
      )}

      {extensionError && (
        <div className="alert alert-error">
          <p>{extensionError}</p>
          <button onClick={() => setExtensionError(null)} aria-label="Cerrar notificación">
            &times;
          </button>
        </div>
      )}

      {sortedReserves.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaCalendarAlt />
          </div>
          <h3>No tienes reservas actualmente</h3>
          <p>Cuando hagas una reserva, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="reserves-list">
          <table className="reserves-table" aria-label="Lista de reservas">
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">
                  <span className="header-with-icon">
                    <FaCalendarAlt /> Fechas
                  </span>
                </th>
                <th scope="col">
                  <span className="header-with-icon">
                    <FaMapMarkerAlt /> Ubicación
                  </span>
                </th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedReserves.map(reserve => {
                const product = products[reserve.productId] || {};
                const checkIn = parseDate(reserve.checkIn);
                const checkOut = parseDate(reserve.checkOut);
                const status = getReservationStatus(reserve.checkOut);
                const statusClass = `status-${status}`;

                return (
                  <tr key={reserve.id} className="reserve-item">
                    <td data-label="Producto">
                      <div className="product-info">
                        {product.images?.[0]?.imageUrl && (
                          <img
                            src={product.images[0].imageUrl}
                            alt={product.title || 'Imagen del producto'}
                            className="product-thumbnail"
                            loading="lazy"
                          />
                        )}
                        <div className="product-details">
                          <div className="product-title">{product.title || 'Producto sin título'}</div>
                          {product.category && (
                            <div className="product-category">{product.category.name}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td data-label="Fechas">
                      <div className="date-info">
                        <div className="date-range">
                          <span className="date-label">Check-in:</span> {checkIn.toLocaleDateString()}
                        </div>
                        <div className="date-range">
                          <span className="date-label">Check-out:</span> {checkOut.toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td data-label="Ubicación">
                      <div className="location-info">
                        {formatLocation(product)}
                      </div>
                    </td>
                    <td data-label="Estado">
                      <span className={`status-badge ${statusClass}`}>
                        {status === 'finalizada' ? 'Finalizada' : 
                         status === 'en curso' ? 'En curso' : 'Próxima'}
                      </span>
                    </td>
                    <td data-label="Acciones">
                      <button
                        className="ca-reserve-btn"
                        onClick={() => handleExtendReserve(reserve.id, reserve.checkOut)}
                        disabled={isExtending || status === 'finalizada'}
                        aria-label={`Extender reserva de ${product.title || 'producto'}`}
                      >
                        {isExtending && extendingReserveId === reserve.id ? (
                          'Procesando...'
                        ) : status === 'finalizada' ? (
                          'Finalizada'
                        ) : (
                          'Extender'
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {extendingReserveId && (
            <div className="modal-overlay" role="dialog" aria-modal="true">
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
                          <p><strong>Última noche:</strong> {new Date(newCheckOut.getTime() - 86400000).toLocaleDateString()}</p>
                          <p><strong>Check-out:</strong> {newCheckOut.toLocaleDateString()}</p>
                        </>
                      )}
                    </div>
                    <div className="modal-buttons">

                    <button
                        className="confirm-btn"
                        onClick={confirmExtension}
                        disabled={!newCheckOut || isExtending}
                        aria-label="Confirmar extensión"
                      >
                        {isExtending ? 'Confirmando...' : 'Confirmar Extensión'}
                      </button>
                      <button
                        className="confirm-btn"
                        onClick={cancelExtension}
                        disabled={isExtending}
                        aria-label="Cancelar extensión"
                      >
                        Cancelar
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