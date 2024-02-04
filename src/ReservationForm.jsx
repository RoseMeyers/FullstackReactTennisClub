import React, { useState, useEffect } from 'react';
import './App.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const TennisClubReservation = () => {
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [unavailableTimeSlots, setUnavailableTimeSlots] = useState([]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const formattedHours = parseInt(hours, 10) % 12 || 12;
    const period = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
    return `${formattedHours}:${minutes} ${period}`;
  };
  const formatTimeSlot = (originalSlot) => {
    const [startTime, endTime] = originalSlot.split('-');
    const formattedStartTime = formatTime(startTime.trim());
    const formattedEndTime = formatTime(endTime.trim());
    return `${formattedStartTime} - ${formattedEndTime}`;
  };

  useEffect(() => {
    if (location.state && location.state.email) {
      setUserEmail(location.state.email);
    }
  }, [location.state]);

  const handleProfileClick = () => {
    navigate('/Profile', { state: { email: userEmail } });
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        const formattedDate = date ? formatDate(date) : formatDate(new Date());
        const response = await fetch(`http://localhost:3001/api/available-time-slots?date=${formattedDate}`);

        if (response.ok) {
          const data = await response.json();
          console.log('Available Time Slots:', data.availableTimeSlots);
          console.log('Unavailable Time Slots:', data.unavailableTimeSlots || []);
          setTimeSlots(data.availableTimeSlots);
          setUnavailableTimeSlots(data.unavailableTimeSlots || []);
        } else {
          console.error('Error fetching available time slots:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching available time slots:', error.message);
      }
    };

    fetchAvailableTimeSlots();

    if (date) {
      fetchAvailableTimeSlots();
    }
  }, [date]);

  const handleSignOut = () => {
    setUserEmail('');
    navigate('/login');
  };

  useEffect(() => {
    if (location.state && location.state.email) {
      setUserEmail(location.state.email);
    }
  }, [location.state]);

  const handleReservationClick = (e) => {
    e.preventDefault();
    if (userEmail) {
      setShowLoginPrompt(false);
      console.log('Selected Time Slot:', selectedTimeSlot);
      handleSubmit(e);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTimeSlot) {
      handleCourtReservation();
    } else {
      setConfirmationMessage('Please select a time slot before submitting.');
    }
  };

  const handleEquipmentReservationClick = async (e) => {
    e.preventDefault();

    if (userEmail) {
      setShowLoginPrompt(false);
      try {
        await handleEquipmentReservation();
      } catch (error) {
        console.error('Error during equipment reservation:', error.message);
        setConfirmationMessage('Sorry, equipment reservation failed. Please try again.');
      }
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleCourtReservation = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/reserveCourt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, date, timeSlot: selectedTimeSlot }),
      });

      if (response.ok) {
        const data = await response.json();
        window.alert('Court successfully reserved!');
        console.log(data.message);
        setConfirmationMessage('');
        setUnavailableTimeSlots((prevUnavailableTimeSlots) => [
          ...prevUnavailableTimeSlots,
          selectedTimeSlot,
        ]);
      } else {
        const errorData = await response.json();
        console.error('Court reservation error:', errorData.message);
        setConfirmationMessage(
          'Sorry, that selected time slot is unavailable. Please select another time.'
        );
      }
    } catch (error) {
      console.error('Error during court reservation:', error.message);
    }
  };

  const handleEquipmentReservation = async () => {
    const numBalls = document.getElementById('numBalls').value;
    const numRackets = document.getElementById('numRackets').value;

    try {
      const response = await fetch('http://localhost:3001/api/reserveEquipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, numBalls, numRackets }),
      });

      if (response.ok) {
        const data = await response.json();
        window.alert('Equipment reservation successful.');
        console.log(data.message);
        setConfirmationMessage('');
      } else {
        console.error('Equipment reservation error:', response.statusText);
      }
    } catch (error) {
      console.error('Error during equipment reservation:', error.message);
    }
  };

  return (
    <div className="center-container">
      <header>
        <h1 className="title">Ace Alliance Tennis Club</h1>
      </header>

      <nav>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/ReservationForm">Reservations</Link>
        <Link to="/HomePage">Home</Link>
        <Link to="/ContactForm">Contact</Link>
        <Link to={{ pathname: "/Profile", state: { email: userEmail } }} onClick={handleProfileClick}>Profile</Link>
        <button onClick={handleSignOut}>Sign Out</button>
      </nav>

      <div className="container">
        <h2 className="welcome">Welcome {userEmail}!</h2>
      </div>

      <div className="container">
        <h2 className="heading">Reserve a Tennis Court</h2>

        <div className="reservation-form">
          <form onSubmit={handleSubmit}>
            <div className="time-slot">
              <label htmlFor="date">Select Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                required
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </div>

            <div className="time-slot">
              <label htmlFor="time">Select Time Slot:</label>

              <select
                id="time"
                name="time"
                required
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="select"
                style={{
                  color: 'gray',
                  WebkitAppearance: 'none',
                }}
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot} disabled={unavailableTimeSlots.includes(slot)}>
                    {formatTimeSlot(slot)}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-btn" onClick={handleReservationClick}>Reserve Now</button>
          </form>

          {showLoginPrompt && (
            <div className="login-prompt">
              <p>Please <Link to="/login"> Login </Link> first to make a reservation.</p>
              <button onClick={() => setShowLoginPrompt(false)}>Cancel</button>
            </div>
          )}

          {confirmationMessage && <p className="confirmation">{confirmationMessage}</p>}
        </div>

        <div className="reservation-form">
          <h2 className="heading">Reserve Tennis Equipment</h2>
          <form id="equipment-form">
            <div className="form-group">
              <label htmlFor="balls">Number of Tennis Balls:</label>
              <input type="number" id="numBalls" name="numBalls" min="1" required className="input" />
            </div>

            <div className="form-group">
              <label htmlFor="rackets">Number of Tennis Rackets:</label>
              <input
                type="number"
                id="numRackets"
                name="numRackets"
                min="1"
                required
                className="input"
              />
            </div>

            <button type="submit" className="submit-btn" onClick={handleEquipmentReservationClick}>
              Reserve Equipment
            </button>
          </form>
        </div>
      </div>

      {showLoginPrompt && (
        <div className="login-prompt">
          <p>Please <Link to="/login"> Login </Link> first to make a reservation.</p>
          <button onClick={() => setShowLoginPrompt(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TennisClubReservation;
