import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './App.css'; 

// Component "SignUp"
const SignUp = () => {
  // Define variables to manage email, password, and message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const isSignUp = location.pathname === '/SignUp';

  // Initialize navigate function to use with this page.
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the registration endpoint that was defined in server.js
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // If registration is successful, set the success message and redirect to the ReservationForm.js page
        const data = await response.json();
        setMessage(data.message);
        // Redirect the user to the ReservationForm page after successful registration
        navigate('/ReservationForm', { state: { email } });
      } else {
        // Handle registration error
        const errorData = await response.json();
        setMessage(errorData.message);
      }
    } catch (error) {
      // If registration fails, handle the error and set the error message
      console.error('Error during registration: ' + error.message);
    }
  };

  return (
    <div className="login-card-container">
      <div className="login-card">
        <header>
          <h1>Welcome to Ace Tennis Club</h1>
        </header>
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/SignUp" className={isSignUp ? 'current-page' : ''}>
            SignUp
          </Link>
          <Link to="/ReservationForm">Reservations</Link>
          <Link to="/HomePage">Home</Link>
          <Link to="/ContactForm">Contact</Link>
        </nav>
        <h2>Create an account</h2>
        <form className="login-card-form" onSubmit={handleSubmit}>
          <div className="form-item">
            <input
              type="text"
              placeholder="Enter Email"
              name="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-item">
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn">
            Register
          </button>
          {message && (
            <div className={message.includes('successful') ? 'success' : 'error'}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
