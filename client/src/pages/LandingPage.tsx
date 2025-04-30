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

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export default function LandingPage() {
  const navigate = useNavigate();
  const { loggedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    if (loggedIn) {
      console.log('User already logged in. Redirecting...');
      navigate('/filter');
    }
  }, [loggedIn, navigate]);

  const handleScrollToForm = () => {
    const formSection = document.getElementById('auth-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        formSection.classList.add('bounce');
        setTimeout(() => {
          formSection.classList.remove('bounce');
        }, 800);
      }, 600);
    } else {
      console.warn('Auth form section not found.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!email || !password) {
      setMessage('❌ Please enter both email and password.');
      setMessageType('error');
      console.warn('Login failed: Missing credentials.');
      return;
    }

    console.log('Login submitted:', { email });
    setMessage('✅ Sign-in successful! Redirecting...');
    setMessageType('success');

    setTimeout(() => {
      navigate('/filter');
    }, 1000);
  };

  return (
    <div className="container">
      <section className="landing-hero fade-in">
        <div className="landing-cta">
          <h1>“We all gain knowledge from each other.”</h1>
          <button onClick={handleScrollToForm}>Get Started</button>
        </div>
      </section>

      <section className="mission fade-in">
        <h2>Welcome to <em>Tutor Trader</em></h2>
        <p>
          At <em>Tutor Trader</em>, we believe that every student has both knowledge to share and room to grow.
          Our platform connects learners from all backgrounds, empowering them to teach, learn, and build confidence together...
        </p>
      </section>

      <section className="impact fade-in">
        <h3>The Power of Tutoring</h3>
        <ul>
          <li>High-impact tutoring is 20x more effective for math and 15x for reading.</li>
          <li>Students using tutoring services had a 7% higher success rate. – SBVC</li>
        </ul>

        <h3>Interpersonal Relationships & Academic Success</h3>
        <ul>
          <li>High-quality relationships promote better grades and school well-being. – PMC, ERIC</li>
        </ul>

        <h3>Collaboration & Career Development</h3>
        <ul>
          <li>Peer tutoring boosts empathy, communication, and teamwork skills.</li>
          <li>OCL promotes relationship-building and improved learning outcomes.</li>
        </ul>
      </section>

      <section id="auth-form" className="auth-form fade-in">
        <h2>Join the Community of Fellow Students</h2>

        {message && (
          <div className={`form-message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign In</button>
        </form>

        <h3>
          Not a member yet?{' '}
          <Link to="/signup">Start Here!</Link>
        </h3>
      </section>
    </div>
  );
};

export default LandingPage;