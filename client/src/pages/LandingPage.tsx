import '../styles/globals.css';
import '../styles/landing.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';

const GET_SPLASH = gql`
  query GetSplash {
    landingPage {
      message
    }
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default function LandingPage() {
  const navigate = useNavigate();
  const { loggedIn, setToken } = useAuth();

  const { data: splashData, loading: splashLoading } = useQuery(GET_SPLASH);
  const [login, { loading: loggingIn, error: loginError }] = useMutation(LOGIN);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMsg, setLoginMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  useEffect(() => {
    if (loggedIn) {
      navigate('/filter');
    }
  }, [loggedIn, navigate]);

  if (splashLoading) {
    return <p className="container">Loading…</p>;
  }

  const splashMessage = splashData?.landingPage.message || '“We all gain knowledge from each other.”';

  const handleScrollToForm = () => {
    const el = document.getElementById('auth-form');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth' });
    el.classList.add('bounce');
    setTimeout(() => el.classList.remove('bounce'), 800);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMsg({ text: '', type: '' });

    if (!email || !password) {
      setLoginMsg({ text: '❌ Please enter both email and password.', type: 'error' });
      return;
    }

    try {
      const { data } = await login({ variables: { email, password } });
      const token = data.login.token;
      localStorage.setItem('token', token);
      setToken(token);

      setLoginMsg({ text: '✅ Sign-in successful! Redirecting…', type: 'success' });
      setTimeout(() => navigate('/filter'), 800);
    } catch (err: any) {
      console.error(err);
      setLoginMsg({ text: `❌ ${err.message}`, type: 'error' });
    }
  };

  return (
    <div className="container">
      <section className="landing-hero fade-in">
        <div className="landing-cta">
          <h1>{splashMessage}</h1>
          <button onClick={handleScrollToForm}>Get Started</button>
        </div>
      </section>

      {/* Mission & Impact sections (unchanged) */}
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

        {loginMsg.text && (
          <div className={`form-message ${loginMsg.type}`}>
            {loginMsg.text}
          </div>
        )}
        {loginError && (
          <div className="form-message error">
            {loginError.message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loggingIn}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loggingIn}
            required
          />

          <button type="submit" disabled={loggingIn}>
            {loggingIn ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        <h3>
          Not a member yet? <Link to="/signup">Start Here!</Link>
        </h3>
      </section>
    </div>
  );
}
