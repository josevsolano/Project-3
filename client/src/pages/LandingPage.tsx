import '../styles/globals.css';
import '../styles/landing.css';
import React, { useEffect, useState } from 'react';

const LandingPage: React.FC = () => {
  const [message, setMessage] = useState<string>('');

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
          <h1>{message || '“I’m good at this, and I need help with that.”'}</h1>
          <button>Login</button>
          <button>Sign Up</button>``
        </div>
      </section>
      {/* … */}
    </div>
  );
};

export default LandingPage;