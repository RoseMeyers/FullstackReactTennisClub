import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './App.css';

const Profile = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userReservations, setUserReservations] = useState([]);
  const [userEquipmentReservations, setUserEquipmentReservations] = useState([]);
  const location = useLocation();

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
    } else {
      // Handle the case where there is no email parameter
      console.log('No email parameter in the state');
    }
  }, [location.state]);

  useEffect(() => {
    // Fetch user court reservations
    const fetchUserReservations = async () => {
      if (userEmail) {
        try {
          const response = await fetch(`http://localhost:3001/api/user-reservations?userEmail=${userEmail}`);
          if (response.ok) {
            const data = await response.json();
            setUserReservations(data.userReservations || []);
          } else {
            console.error('Error fetching user court reservations:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching user court reservations:', error.message);
        }
      }
    };

    // Fetch user equipment reservations
    const fetchUserEquipmentReservations = async () => {
      if (userEmail) {
        try {
          const response = await fetch(`http://localhost:3001/api/user-equipment-reservations?userEmail=${userEmail}`);
          if (response.ok) {
            const data = await response.json();
            setUserEquipmentReservations(data.userEquipmentReservations || []);
          } else {
            console.error('Error fetching user equipment reservations:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching user equipment reservations:', error.message);
        }
      }
    };

    // Call both functions to fetch reservations
    fetchUserReservations();
    fetchUserEquipmentReservations();
  }, [userEmail, location.state]);

  console.log('Email in Profile:', userEmail);

  return (
    <div className="profile-card-container">
      <div className="profile-card">
        <header>
          <h1>Welcome to Ace Tennis Club</h1>
        </header>
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/ReservationForm">Reservations</Link>
          <Link to="/HomePage">Home</Link>
          <Link to="/ContactForm">Contact</Link>
        </nav>

        <div className="container">
          <h2>User Profile</h2>
          <div className="user-details">
            <p>Email: {userEmail}</p>
          </div>
        </div>

        <div className="container">
          <h2>User Court Reservations</h2>
          <ul>
            {userReservations.map((reservation) => (
              <li key={reservation.id}>
                Date: {new Date(reservation.date).toLocaleDateString()}, Time Slot: {formatTimeSlot(reservation.time_slot)}
              </li>
            ))}
          </ul>
        </div>

        {/* Display user equipment reservations */}
        <div className="container">
          <h2>User Equipment Reservations</h2>
          <ul>
            {userEquipmentReservations.map((equipmentReservation) => (
              <li key={equipmentReservation.id}>
                Number of Balls: {equipmentReservation.numBalls}, Number of Rackets: {equipmentReservation.numRackets}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
