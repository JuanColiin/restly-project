import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaRegCalendar } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './NavBar.css';

const NavBar = ({ setFilteredProducts }) => {
  const [showCalendars, setShowCalendars] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getDateRangeText = () => {
    return checkIn && checkOut
      ? `${formatDate(checkIn)} - ${formatDate(checkOut)}`
      : 'Check in - Check out';
  };

  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split('T')[0];

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(formattedDate);
      setCheckOut(null);
    } else {
      if (new Date(formattedDate) < new Date(checkIn)) {
        setCheckIn(formattedDate);
      } else {
        setCheckOut(formattedDate);
        setShowCalendars(false);
      }
    }
  };

  useEffect(() => {
    if (searchQuery.length > 1) {
      axios
        .get(`http://localhost:8080/products/suggestions?query=${searchQuery}`)
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

  const handleSearch = () => {
    let url = 'http://localhost:8080/products/filter';
    const params = new URLSearchParams();

    if (searchQuery) params.append('location', searchQuery);
    if (checkIn && checkOut) {
      params.append('checkIn', checkIn);
      params.append('checkOut', checkOut);
    }

    axios
      .get(`${url}?${params.toString()}`)
      .then((response) => setFilteredProducts(response.data))
      .catch((error) => console.error('Error en la búsqueda:', error));
  };

  const renderCalendar = (monthOffset) => {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const monthName = currentMonth.toLocaleString('es-ES', { month: 'long' });
    const year = currentMonth.getFullYear();

    const days = Array.from({ length: firstDay }, (_, i) => (
      <div key={`empty-${i}`} className="calendar-day empty"></div>
    ));

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const formattedDate = date.toISOString().split('T')[0];

      const isSelected = formattedDate === checkIn || formattedDate === checkOut;
      const isInRange = checkIn && checkOut && formattedDate > checkIn && formattedDate < checkOut;
      const isDisabled = date < today;

      days.push(
        <div
          key={formattedDate}
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
          <h3>{monthName} {year}</h3>
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
                <li key={index} onClick={() => handleSuggestionClick(s)}>
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
              {renderCalendar(0)}
              {renderCalendar(1)}
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
