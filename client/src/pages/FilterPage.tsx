import '../styles/globals.css';
import '../styles/filter.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FilterPage() {
   const navigate = useNavigate();

   const handleNextCandidate = () => {
     navigate('/next-candidate'); // Replace with the actual route for the next candidate
   };

   const handleLastCandidate = () => {
     navigate('/last-candidate'); // Replace with the actual route for the last candidate
   };

   const handleAddCandidate = () => {
     navigate('/add-candidate'); // Replace with the actual route for adding a candidate
   };

  return (
    <div className="container">
      <section className="filter-hero">
        <div className="filter-cta">
          <h1>"Select Tutor to trade Knowledge with.”</h1>
          <button onClick={handleNextCandidate}>Next Candidate</button>
          <button onClick={handleLastCandidate}>Last Candidate</button>
          <button onClick={handleAddCandidate}>Add Candidate</button>
        </div>
      </section>
      {/* … */}
    </div>
  );
}