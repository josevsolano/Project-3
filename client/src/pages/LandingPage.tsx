import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import '../styles/globals.css';
import '../styles/landing.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loggedIn, setToken } = useAuth();

  const [landingMessage, setLandingMessage] = useState<string>('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [loginType, setLoginType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    if (loggedIn) {
      navigate('/filter');
    }
  }, [loggedIn, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/landingpage');
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        setLandingMessage(data.message);
      } catch (err) {
        console.error('Error fetching landing message:', err);
      }
    })();
  }, []);

  const handleScrollToForm = () => {
    const el = document.getElementById('auth-form');
    if (!el) return console.warn('Auth form not found');
    el.scrollIntoView({ behavior: 'smooth' });
    el.classList.add('bounce');
    setTimeout(() => el.classList.remove('bounce'), 800);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage('');
    setLoginType('');

    if (!email || !password) {
      setLoginMessage('❌ Please enter both email and password.');
      setLoginType('error');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setLoginMessage('✅ Sign-in successful! Redirecting…');
      setLoginType('success');

      setTimeout(() => navigate('/filter'), 800);
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginMessage(`❌ ${err.message}`);
      setLoginType('error');
    }
  };

  return (
    <div className="container">
      <section className="landing-hero fade-in">
        <div className="landing-cta">
          <h1>{landingMessage || '“We all gain knowledge from each other.”'}</h1>
          <button onClick={handleScrollToForm}>Get Started</button>
        </div>
      </section>

      <section className="mission fade-in">
        <h2>Welcome to <em>Tutor Trader</em></h2>
        <p>
          At <em>Tutor Trader</em>, we believe that every student has both knowledge to share
          and room to grow. Our platform connects learners from all backgrounds, empowering
          them to teach, learn, and build confidence together...
        </p>
      </section>

      <section className="impact fade-in">
        <h3>The Power of Tutoring</h3>
        <ul>
          <li>High-impact tutoring is 20× more effective for math and 15× for reading.</li>
          <li>Students using tutoring services saw a 7% higher success rate. – SBVC</li>
        </ul>

        <h3>Interpersonal Relationships & Academic Success</h3>
        <ul>
          <li>Strong peer relationships boost grades and well-being. – PMC, ERIC</li>
        </ul>

        <h3>Collaboration & Career Development</h3>
        <ul>
          <li>Peer tutoring fosters empathy, communication, and teamwork.</li>
          <li>Collaborative learning leads to better outcomes. – OCL studies</li>
        </ul>
      </section>

      <section id="auth-form" className="auth-form fade-in">
        <h2>Join the Community of Fellow Students</h2>

        {loginMessage && (
          <div className={`form-message ${loginType}`}>
            {loginMessage}
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
            onChange={e => setEmail(e.target.value)}
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button type="submit">Sign In</button>
        </form>

        <h3>
          Not a member yet? <Link to="/signup">Start Here!</Link>
        </h3>
      </section>
    </div>
  );
};

export default LandingPage;
