import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css'; // Import CSS file for styling 

// Login component
function Login() {
  // React component that handles the login functionality on the client side.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate('/ReservationForm', { state: { email } });
      } else {
        if (response.status === 401) {
          alert("Email not found. Please create an account.");
        } else {
          alert("Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    // Defines the layout, nav links, form elements, other UI components
    <div className="login-card-container">
      <div className="login-card">
        <header>
          <h1>Welcome to Ace Tennis Club</h1>
        </header>
        <nav>
          <Link to="/login" className={isLoginPage ? 'current-page' : ''}>
            Login</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/ReservationForm">Reservations</Link>
          <Link to="/HomePage">Home</Link>
          <Link to="/ContactForm">Contact</Link>
        </nav>
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
          <div className="form-item-other">
            {/* Checkbox and forgot password link.. forgot password page TBD */}
            <div className="checkbox">
              <input type="checkbox" id="rememberMeCheckbox" defaultChecked />
              <label htmlFor="rememberMeCheckbox">Remember me</label>
            </div>
            <Link to="#">Forgot password?</Link>
          </div>
          <button type="submit" className="submit-btn">
            Sign In
          </button>
        </form>
        <div>
          Don't have an account? Create a free account <Link to="/SignUp"> here </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
