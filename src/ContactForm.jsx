import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './App.css'; // Import CSS file for styling

const ContactForm = () => {
  const location = useLocation();
  const isContactPage = location.pathname === '/ContactForm';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        const data = await response.json();
        setName('');
        setEmail('');
        setMessage('');
        setSubmitMessage(data.message);
      } else {
        setSubmitMessage('Failed to submit the form. Please try again later.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
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
          <Link to="/signup">Sign Up</Link>
          <Link to="/ReservationForm">Reservations</Link>
          <Link to="/HomePage">Home</Link>
          <Link to="/ContactForm" className={isContactPage ? 'current-page' : ''}>
            Contact
          </Link>
        </nav>
        <div className="container">
          <h2>Contact Us</h2>
          <form className="login-card-form" onSubmit={handleSubmit}>
            <div className="form-item">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
          {submitMessage && (
            <div className={`message ${submitMessage.includes('successful') ? 'success' : 'error'}`}>
              {submitMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
