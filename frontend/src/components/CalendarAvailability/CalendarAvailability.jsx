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

  const [bookedRanges, setBookedRanges] = useState([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [product, setProduct] = useState(null);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;


  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calculateNights = (start, end) => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const fetchDates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${apiUrl}/reserves/product/${numericProductId}`
      );

      const ranges = response.data.map(reserve => {
        const [y1, m1, d1] = reserve.checkIn.split("-");
        const [y2, m2, d2] = reserve.checkOut.split("-");

        const checkIn = new Date(Number(y1), Number(m1) - 1, Number(d1));
        const checkOut = new Date(Number(y2), Number(m2) - 1, Number(d2));

        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);

        return { checkIn, checkOut };
      });

      setBookedRanges(ranges);
    } catch {
      setError("No se pudo obtener la información. Intente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`${apiUrl}/products/${numericProductId}`);
      setProduct(res.data);
    } catch {
      setError("Error al obtener los detalles del producto");
    }
  };

  useEffect(() => {
    if (productId) {
      fetchDates();
      fetchProductDetails();
    }
  }, [productId]);

  const isBooked = (date) => {
    const format = (d) => d.toISOString().split("T")[0];
    const day = format(date);

    const isInBookedRange = bookedRanges.some(range => {
      const start = format(range.checkIn);
      const end = format(range.checkOut);
      return day >= start && day < end;
    });

    const isInCurrentSelection = checkIn && checkOut &&
      day >= format(checkIn) && day < format(checkOut);

    return isInBookedRange || isInCurrentSelection;
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
        setCheckIn(normalizedDate);
        setCheckOut(null);
      }
    }
  };

  const handleReserve = () => {
    if (!user) {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      return navigate("/login");
    }

    if (!checkIn || !checkOut) {
      return Swal.fire({
        title: "Error",
        text: "Selecciona un rango de fechas válido",
        icon: "error",
        confirmButtonColor: "#00c98c",
      });
    }

    const nights = calculateNights(checkIn, checkOut);

    if (nights < 1 || nights > 30) {
      return Swal.fire({
        title: "Rango inválido",
        text: "La reserva debe ser de mínimo 1 noche y máximo 30 días.",
        icon: "warning",
        confirmButtonColor: "#00c98c",
      });
    }

    const conflict = bookedRanges.some(range => {
      return checkIn < range.checkOut && checkOut > range.checkIn;
    });

    if (conflict) {
      return Swal.fire({
        title: "Fechas ya reservadas",
        text: "Las fechas seleccionadas ya están reservadas. Por favor, elige otro rango de fechas.",
        icon: "error",
        confirmButtonColor: "#00c98c",
      });
    }

    setShowModal(true);
  };

  const confirmReservation = async () => {
    try {
      await axios.post(`${apiUrl}/reserves`, {
        startTime: "14:00:00",
        checkIn: checkIn.toISOString().split("T")[0],
        checkOut: checkOut.toISOString().split("T")[0],
        productId: numericProductId,
        userId: user.userId,
      });

      Swal.fire({
        title: "Reserva exitosa",
        text: "Tu reserva ha sido confirmada",
        icon: "success",
        confirmButtonColor: "#00c98c",
      });

      setShowModal(false);
      setCheckIn(null);
      setCheckOut(null);
      await fetchDates();
    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudo completar la reserva",
        icon: "error",
        confirmButtonColor: "#00c98c",
      });
    }
  };

  const renderCalendar = (offset) => {
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + offset, 1);
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

      const isDisabled = date < today || isBooked(date);
      const isSelected = (checkIn && date.getTime() === checkIn.getTime()) || 
                         (checkOut && date.getTime() === checkOut.getTime());
      const isInRange = checkIn && checkOut && date > checkIn && date < checkOut;

      days.push(
        <div
          key={date.toISOString()}
          className={`ca-calendar-day ${isSelected ? "ca-selected" : ""} ${isInRange ? "ca-range-selected" : ""} ${isDisabled ? "ca-disabled" : ""}`}
          onClick={() => !isDisabled && handleDateSelection(date)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="ca-calendar">
        <div className="ca-calendar-header">
          <button className="ca-nav-button" onClick={() => setMonthOffset((prev) => prev - 1)} disabled={monthOffset <= 0}>
            <FaChevronLeft />
          </button>
          <h3>{monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}</h3>
          <button className="ca-nav-button" onClick={() => setMonthOffset((prev) => prev + 1)} disabled={monthOffset >= 5}>
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
      <h3><FaRegCalendar className="ca-calendar-icon" /> Disponibilidad</h3>

      {loading && <p className="ca-loading">Cargando disponibilidad...</p>}
      {error && <p className="ca-error-message">{error}</p>}

      <div className="ca-calendars-container">
        {renderCalendar(monthOffset)}
        {renderCalendar(monthOffset + 1)}
      </div>

      {checkIn && checkOut && (
        <div className="ca-selected-dates-summary">
          <p><strong>Check-in:</strong> {checkIn.toLocaleDateString("es-ES")}</p>
          <p><strong>Check-out:</strong> {checkOut.toLocaleDateString("es-ES")}</p>
          <p><strong>Noches:</strong> {calculateNights(checkIn, checkOut)}</p>
        </div>
      )}

      <div className="ca-button-container">
        <button className="ca-reserve-btn" onClick={handleReserve} disabled={!checkIn || !checkOut}>
          Confirmar Reserva
        </button>
      </div>

      {showModal && product && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Confirmar Reserva</h2>

            <div className="modal-product-details">
              <img src={product.images?.[0]?.imageUrl} alt={product.title} className="modal-product-image" />
              <h3>{product.title}</h3>
              <p className="modal-location">{product.address?.city?.name}, {product.address?.city?.state?.country?.name}</p>
              <p className="modal-description">{product.description?.substring(0, 120)}...</p>
            </div>

            <div className="modal-user-info">
              <p><strong>Usuario:</strong> {user.firstname}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Check-in:</strong> {checkIn.toLocaleDateString("es-ES")}</p>
              <p><strong>Check-out:</strong> {checkOut.toLocaleDateString("es-ES")}</p>
              <p><strong>Noches:</strong> {calculateNights(checkIn, checkOut)}</p>
            </div>

            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmReservation}>Confirmar</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CalendarAvailability.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default CalendarAvailability;