import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaRegCalendar, FaChevronLeft, FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './NavBar.css';



const apiUrl = import.meta.env.VITE_BACKEND_URL;

const NavBar = ({ setFilteredProducts }) => {
  const [showCalendars, setShowCalendars] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [monthOffset, setMonthOffset] = useState(0);

  const formatDate = (date) => {
    if (!date) return '';
    const parsedDate = date instanceof Date ? date : new Date(date);
    return parsedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getDateRangeText = () => {
    return checkIn && checkOut ? `${formatDate(checkIn)} - ${formatDate(checkOut)}` : 'Check in - Check out';
  };

  const handleDateSelect = (date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else {
      if (date < checkIn) {
        setCheckIn(date);
      } else {
        setCheckOut(date);
        setShowCalendars(false);
      }
    }
  };

  useEffect(() => {
    if (searchQuery.length > 1) {
      axios
        .get(`${apiUrl}/products/suggestions?query=${searchQuery}`)
        .then((response) => setSuggestions(response.data))
        .catch((error) => console.error('Error obteniendo sugerencias:', error));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    handleSearch();
  };

  const handleSearch = async () => {
    let url = `${apiUrl}/products/filter`;
    const params = new URLSearchParams();

    if (!searchQuery && !checkIn && !checkOut) {
      console.warn("Debe ingresar al menos un criterio de búsqueda.");
      return;
    }

    if (searchQuery) params.append("location", searchQuery.trim());

    if (checkIn && checkOut) {
      try {
        params.append("checkIn", new Date(checkIn).toISOString().split("T")[0]);
        params.append("checkOut", new Date(checkOut).toISOString().split("T")[0]);
      } catch (error) {
        console.error("Error al procesar las fechas:", error);
        return;
      }
    }

    try {
      const response = await axios.get(`${url}?${params.toString()}`);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };


  const renderCalendar = (offset) => {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const monthName = currentMonth.toLocaleString('es-ES', { month: 'long' });
    const year = currentMonth.getFullYear();

    const days = Array.from({ length: firstDay }, (_, i) => (
      <div key={`empty-${i}`} className="calendar-day empty"></div>
    ));

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

      const isSelected = checkIn?.toDateString() === date.toDateString() || checkOut?.toDateString() === date.toDateString();
      const isInRange = checkIn && checkOut && date > checkIn && date < checkOut;
      const isDisabled = date < today;

      days.push(
        <div
          key={date.toISOString()}
          className={`calendar-day ${isSelected ? 'selected' : ''} 
                       ${isInRange ? 'in-range' : ''} 
                       ${isDisabled ? 'disabled' : ''}`}
          onClick={() => !isDisabled && handleDateSelect(date)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button className="nav-button" onClick={() => setMonthOffset((prev) => prev - 1)}>
            <FaChevronLeft />
          </button>
          <h3>{monthName} {year}</h3>
          <button className="nav-button" onClick={() => setMonthOffset((prev) => prev + 1)}>
            <FaChevronRight />
          </button>
        </div>
        <div className="calendar-weekdays">
          <div>Lu</div>
          <div>Ma</div>
          <div>Mi</div>
          <div>Ju</div>
          <div>Vi</div>
          <div>Sa</div>
          <div>Do</div>
        </div>
        <div className="calendar-days">{days}</div>
      </div>
    );
  };

  return (
    <div className="search-container">
      <h1>Busca ofertas en hoteles, casas y mucho más</h1>

      <div className="search-box">
        <div className="input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="¿A dónde vamos?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((s, index) => (
                <li key={index} onClick={() => handleSuggestionClick(s)} className="suggestion-item">
                  <FaMapMarkerAlt className="location-icon" />
                  {s}
                </li>
              ))}

            </ul>
          )}
        </div>

        <div className="date-picker-container">
          <div className="date-input" onClick={() => setShowCalendars(!showCalendars)}>
            <FaRegCalendar className="calendar-icon" />
            <span>{getDateRangeText()}</span>
          </div>

          {showCalendars && (
            <div className="calendars-container">
              {renderCalendar(monthOffset)}
              {renderCalendar(monthOffset + 1)}
            </div>
          )}
        </div>

        <button className="search-button" onClick={handleSearch}>
          Buscar
        </button>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  setFilteredProducts: PropTypes.func.isRequired,
};

export default NavBar;
