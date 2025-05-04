import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage   from './pages/LandingPage';
import SignupPage    from './pages/SignupPage';
import FilterPage    from './pages/FilterPage';
import CandidatePage from './pages/CandidatePage';
import ContactPage   from './pages/ContactPage';

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<LandingPage />} />
      <Route path="/signup"      element={<SignupPage />} />
      <Route path="/filter"      element={<FilterPage />} />
      <Route path="/candidate/:id" element={<CandidatePage />} />
      <Route path="/contact"     element={<ContactPage />} />
    </Routes>
  );
}
