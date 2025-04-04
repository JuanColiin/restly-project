import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FaRegCalendar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Swal from "sweetalert2";
import AuthContext from "../../context/AuthContext";
import "./CalendarAvailability.css";

const CalendarAvailability = ({ productId }) => {
  // Convertir productId a número si viene como string
  const numericProductId = Number(productId);
  
  const { user } = useContext(AuthContext);
  const [bookedDates, setBookedDates] = useState([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const today = new Date();
  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(today.getMonth() + 6);

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
      setBookedDates(response.data.bookedDates.map((date) => new Date(date)));
    } catch {
      setError("No se pudo obtener la información. Intente más tarde.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (productId) {
      fetchDates();
    }
  }, [productId]);

  const isBooked = (date) =>
    bookedDates.some((booked) => booked.toDateString() === date.toDateString());

  const handleDateSelection = (date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else if (checkIn && !checkOut) {
      if (date.getTime() === checkIn.getTime()) {
        setCheckIn(null);
      } else if (date > checkIn) {
        setCheckOut(date);
      }
    }
  };
  
  const handleReserve = async () => {
    if (!user) {
      return Swal.fire("Error", "Debes iniciar sesión para reservar", "error");
    }
    if (!checkIn || !checkOut) {
      return Swal.fire("Error", "Selecciona un rango de fechas válido", "error");
    }
    try {
      await axios.post("http://localhost:8080/reserves", {
        startTime: "14:00:00",
        checkIn: checkIn.toISOString().split("T")[0],
        checkOut: checkOut.toISOString().split("T")[0],
        productId,
        userId: user.userId,
      });
      Swal.fire("Reserva exitosa", "Tu reserva ha sido confirmada", "success");
    } catch {
      Swal.fire("Error", "No se pudo completar la reserva", "error");
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
      const isDisabled = date < today || isBooked(date);
  
      const isSelected =
        (checkIn && date.toDateString() === checkIn.toDateString()) ||
        (checkOut && date.toDateString() === checkOut.toDateString());
  
      const isInRange =
        checkIn && checkOut && date > checkIn && date < checkOut;
  
      days.push(
        <div
          key={date.toISOString()}
          className={`ca-calendar-day ${isSelected ? "ca-selected" : ""} 
            ${isInRange ? "ca-range-selected" : ""} ${isDisabled ? "ca-disabled" : ""}`}
          onClick={() => !isDisabled && handleDateSelection(date)}
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
          >
            <FaChevronLeft />
          </button>
          <h3>
            {monthName} {year}
          </h3>
          <button
            className="ca-nav-button"
            onClick={() => setMonthOffset((prev) => prev + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="ca-calendar-weekdays">
          <div>Lu</div>
          <div>Ma</div>
          <div>Mi</div>
          <div>Ju</div>
          <div>Vi</div>
          <div>Sa</div>
          <div>Do</div>
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
      {loading && <p className="ca-loading">Cargando disponibilidad...</p>}
      {error && <p className="ca-error-message">{error}</p>}
      <div className="ca-calendars-container">
        {renderCalendar(monthOffset)}
        {renderCalendar(monthOffset + 1)}
      </div>
      {checkIn && checkOut && (
        <button className="ca-reserve-btn" onClick={handleReserve}>
          Confirmar Reserva
        </button>
      )}
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
