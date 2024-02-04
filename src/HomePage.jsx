import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './App.css';

const HomePage = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/HomePage';

  return (
    <div className="body">
      <header>
        <h1>Welcome to Ace Tennis Club</h1>
      </header>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/ReservationForm">Reservations</Link>
        <Link to="/HomePage" className={isHomePage ? 'current-page' : ''}>
          Home
        </Link>
        <Link to="/ContactForm">Contact</Link>
      </nav>

      <div className="container">
        <div className="highlighted-section">
          <h2>Elevate your Game, Reserve your Space! Book Courts, Gear Up, Ace Every Match!</h2>
        </div>
        <p>
          Join our tennis club and enjoy the thrill of playing tennis on our world-class courts.
          Whether you're a beginner or an experienced player, we have something for everyone.
        </p>

        <div className="why-choose" style={{ background: `rgba(255, 255, 255, 0.6) url(${process.env.PUBLIC_URL}/images/tennis-court-panorama-background-blue-260nw-1519626935.jpg)`, backgroundBlendMode: 'screen' }}>
          <h3>Why Choose Our Tennis Club?</h3>
          <ul>
            <li>Professional Coaching Staff</li>
            <li>State-of-the-Art Tennis Courts</li>
            <li>Friendly Community Atmosphere</li>
            <li>Regular Tournaments and Events</li>
          </ul>
        </div>

        <p className="welcome-text">
          Ready to get started? <Link to="/signup">Sign up now</Link> and become a part of our vibrant tennis community!
        </p>
        <p className="login-text">
          Please <Link to="/login">login</Link> to make reservations!
        </p>

        <h3>
          Looking to reserve courts or equipment? Click <Link to="/ReservationForm">here</Link>!
        </h3>
      </div>
    </div>
  );
};

export default HomePage;
