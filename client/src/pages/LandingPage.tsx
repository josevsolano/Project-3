// e.g. in LandingPage.tsx
import '../styles/globals.css';
import '../styles/landing.css';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const LandingPage: React.FC = () => {
  const[message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('/api/landingpage');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    fetchMessage();
  }, []);
  return (
    <div className="container">
      <section className="landing-hero">
        <div className="landing-cta">
          <h1>{message}</h1>
          <button>Get Started</button>
        </div>
      </section>
      {/* … */}
    </div>
  );

export default function LandingPage() {
  return (
    <div className="container">
      <section className="landing-hero">
        <div className="landing-cta">
          <h1>“I’m good at this, and I need help with that.”</h1>
          <button>Get Started</button>
        </div>
      </section>
      {/* … */}
    </div>
  );
}
