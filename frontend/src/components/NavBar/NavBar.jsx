import  { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaRegCalendar } from 'react-icons/fa';
import './NavBar.css';

const NavBar = () => {
  const [showCalendars, setShowCalendars] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
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

  const getDateRangeText = () => {
    if (checkIn && checkOut) {
      return `${formatDate(checkIn)} - ${formatDate(checkOut)}`;
    }
    return 'Check in - Check out';
  };

  const renderCalendar = (month) => {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + month, 1);
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const monthName = currentMonth.toLocaleString('es-ES', { month: 'long' });
    const year = currentMonth.getFullYear();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = (checkIn && date.toDateString() === checkIn.toDateString()) ||
                        (checkOut && date.toDateString() === checkOut.toDateString());
      const isInRange = checkIn && checkOut && date > checkIn && date < checkOut;
      const isDisabled = date < today;

      days.push(
        <div
          key={date}
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
        <div className="calendar-days">
          {days}
        </div>
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
          />
        </div>

        <div className="date-picker-container">
          <div 
            className="date-input"
            onClick={() => setShowCalendars(!showCalendars)}
          >
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

        <button className="search-button">
          Buscar
        </button>
      </div>
    </div>
  );
};

export default NavBar;

