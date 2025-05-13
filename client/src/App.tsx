// client/src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage   from './pages/LandingPage';
import SignupPage    from './pages/SignupPage';
import FilterPage    from './pages/FilterPage';
import CandidatePage from './pages/CandidatePage';
import ContactPage   from './pages/ContactPage';

export default function App() {
  return (
    <Routes>
      {/* 1. Your “home” landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Other top‐level routes */}
      <Route path="/signup"       element={<SignupPage    />} />
      <Route path="/filter"       element={<FilterPage    />} />
      <Route path="/candidate/:id" element={<CandidatePage />} />
      <Route path="/contact"      element={<ContactPage   />} />

      {/* 3. Fallback: any unknown URL → redirect back to “/” */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
