import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ReservationForm from './ReservationForm';
import Login from './Login';
import SignUp from './SignUp';
import HomePage from './HomePage';
import ContactForm from './ContactForm';
import Profile from './Profile';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/ReservationForm" element={<ReservationForm />} />          
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/ContactForm" element={<ContactForm />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
