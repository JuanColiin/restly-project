import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FaRegCalendar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Swal from "sweetalert2";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CalendarAvailability.css";

const CalendarAvailability = ({ productId }) => {
  const numericProductId = Number(productId);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookedDates, setBookedDates] = useState([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar la fecha
  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(today.getMonth() + 6);
  sixMonthsLater.setHours(0, 0, 0, 0);

  const fetchDates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8080/reserves/product/${numericProductId}/dates`,
        {
          params: {
            startDate: today.toISOString().split("T")[0],
            endDate: sixMonthsLater.toISOString().split("T")[0],
          },
        }
      );
      setBookedDates(response.data.bookedDates.map((date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
      }));
    } catch (err) {
      console.error("Error fetching dates:", err);
      setError("No se pudo obtener la información. Intente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchDates();
    }
  }, [productId]);

  const isBooked = (date) => {
    return bookedDates.some((booked) => booked.getTime() === date.getTime());
  };

  const handleDateSelection = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(normalizedDate);
      setCheckOut(null);
    } else if (checkIn && !checkOut) {
      if (normalizedDate.getTime() === checkIn.getTime()) {
        setCheckIn(null);
      } else if (normalizedDate > checkIn) {
        setCheckOut(normalizedDate);
      } else {
        // Si la fecha seleccionada es anterior a checkIn, establecer como nuevo checkIn
        setCheckIn(normalizedDate);
        setCheckOut(null);
      }
    }
  };

  const handleReserve = async () => {
    if (!user) {
      const result = await Swal.fire({
        title: "Sesión requerida",
        text: "Debes iniciar sesión para realizar una reserva",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir a login",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#00c98c",  // Color de la paleta
        cancelButtonColor: "#d33",
        customClass: {
          popup: 'popup-style',
          title: 'title-style',
          content: 'content-style',
        },
      });
  
      if (result.isConfirmed) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        navigate("/login");
      }
      return;
    }
  
    if (!checkIn || !checkOut) {
      return Swal.fire({
        title: "Error",
        text: "Selecciona un rango de fechas válido",
        icon: "error",
        confirmButtonColor: "#00c98c",  // Color de la paleta
        customClass: {
          popup: 'popup-style',
          title: 'title-style',
          content: 'content-style',
        },
      });
    }
  
    const checkInStr = checkIn.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const checkOutStr = checkOut.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const diffInDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
    if (diffInDays < 1 || diffInDays > 30) {
      return Swal.fire({
        title: "Rango inválido",
        text: "La reserva debe ser de mínimo 1 noche y máximo 30 días.",
        icon: "warning",
        confirmButtonColor: "#00c98c",  // Color de la paleta
        customClass: {
          popup: 'popup-style',
          title: 'title-style',
          content: 'content-style',
        },
      });
    }
  
    const confirmResult = await Swal.fire({
      title: "Confirmar reserva",
      html: `
        <div style="text-align: center;">
          <p>¿Estás seguro de realizar esta reserva?</p>
          <p><strong>Check-in:</strong> ${checkInStr}</p>
          <p><strong>Check-out:</strong> ${checkOutStr}</p>
          <p><strong>Noches:</strong> ${diffInDays}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, reservar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#00c98c",  // Color de la paleta
      cancelButtonColor: "#d33",
      customClass: {
        popup: 'popup-style',
        title: 'title-style',
        content: 'content-style',
      },
    });
  
    if (confirmResult.isConfirmed) {
      try {
        await axios.post("http://localhost:8080/reserves", {
          startTime: "14:00:00",
          checkIn: checkIn.toISOString().split("T")[0],
          checkOut: checkOut.toISOString().split("T")[0],
          productId: numericProductId,
          userId: user.userId,
        });
        
        await Swal.fire({
          title: "Reserva exitosa",
          text: "Tu reserva ha sido confirmada",
          icon: "success",
          confirmButtonColor: "#00c98c",  // Color de la paleta
          customClass: {
            popup: 'popup-style',
            title: 'title-style',
            content: 'content-style',
          },
        });
        
        setCheckIn(null);
        setCheckOut(null);
        await fetchDates(); // Refrescar fechas reservadas
      } catch (err) {
        console.error("Reservation error:", err);
        Swal.fire({
          title: "Error",
          text: "No se pudo completar la reserva",
          icon: "error",
          confirmButtonColor: "#00c98c",  // Color de la paleta
          customClass: {
            popup: 'popup-style',
            title: 'title-style',
            content: 'content-style',
          },
        });
      }
    }
  };
  
  

  const renderCalendar = (offset) => {
    const currentMonth = new Date(
      today.getFullYear(),
      today.getMonth() + offset,
      1
    );
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();

    const monthName = currentMonth.toLocaleString("es-ES", { month: "long" });
    const year = currentMonth.getFullYear();

    const days = Array.from({ length: firstDay }, (_, i) => (
      <div key={`empty-${i}`} className="ca-calendar-day ca-empty"></div>
    ));

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      date.setHours(0, 0, 0, 0);
      
      const isDisabled = date < today || isBooked(date);
      const isSelected =
        (checkIn && date.getTime() === checkIn.getTime()) ||
        (checkOut && date.getTime() === checkOut.getTime());
      const isInRange =
        checkIn && checkOut && date > checkIn && date < checkOut;

      days.push(
        <div
          key={date.toISOString()}
          className={`ca-calendar-day 
            ${isSelected ? "ca-selected" : ""} 
            ${isInRange ? "ca-range-selected" : ""} 
            ${isDisabled ? "ca-disabled" : ""}`}
          onClick={() => !isDisabled && handleDateSelection(date)}
          aria-label={`Día ${day} de ${monthName}`}
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
            onClick={() => setMonthOffset((prev) => prev - 1)}
            disabled={monthOffset <= 0}
            aria-label="Mes anterior"
          >
            <FaChevronLeft />
          </button>
          <h3 aria-label={`${monthName} ${year}`}>
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}
          </h3>
          <button
            className="ca-nav-button"
            onClick={() => setMonthOffset((prev) => prev + 1)}
            disabled={monthOffset >= 5}
            aria-label="Mes siguiente"
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

  return (
    <div className="ca-calendar-container">
      <h3>
        <FaRegCalendar className="ca-calendar-icon" /> Disponibilidad
      </h3>
      
      {loading && (
        <div className="ca-loading-container">
          <p className="ca-loading">Cargando disponibilidad...</p>
        </div>
      )}
      
      {error && (
        <div className="ca-error-container">
          <p className="ca-error-message">{error}</p>
          <button 
            className="ca-retry-btn" 
            onClick={fetchDates}
            aria-label="Reintentar"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="ca-calendars-container">
        {renderCalendar(monthOffset)}
        {renderCalendar(monthOffset + 1)}
      </div>

      {checkIn && checkOut && (
        <div className="ca-selected-dates-summary">
          <p>
            <strong>Check-in:</strong>{" "}
            {checkIn.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {checkOut.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>
            <strong>Noches:</strong>{" "}
            {Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))}
          </p>
        </div>
      )}

      <div className="ca-button-container">
        <button
          className="ca-reserve-btn"
          onClick={handleReserve}
          disabled={!checkIn || !checkOut}
          aria-label="Confirmar reserva"
        >
          Confirmar Reserva
        </button>
      </div>
    </div>
  );
};

CalendarAvailability.propTypes = {
  productId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
};

export default CalendarAvailability;