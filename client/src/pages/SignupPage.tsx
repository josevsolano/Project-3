import '../styles/globals.css';
import '../styles/signup.css';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    skills: [] as string[],
    needs: [] as string[],
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjectOptions = [
    "Math", "Science", "English", "History",
    "Spanish", "Computer Science", "Art",
    "Music", "Writing", "Medical", "Psychology",
    "Economics", "Business", "Philosophy",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, o => o.value);
    setFormData(prev => ({ ...prev, [e.target.name]: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords don't match.");
      setMessageType('error');
      return;
    }
    if (
      !formData.email ||
      !formData.password ||
      formData.skills.length === 0 ||
      formData.needs.length === 0
    ) {
      setMessage("❌ All fields are required.");
      setMessageType('error');
      return;
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      skills: formData.skills,
      needs: formData.needs,
    };

    try {
      setIsSubmitting(true);

      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }

      setMessage("✅ Signup successful! Redirecting...");
      setMessageType('success');

      setTimeout(() => navigate('/filter'), 1000);
    } catch (err: any) {
      console.error('Signup error:', err);
      setMessage(`❌ ${err.message}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container fade-in">
      <header className="signup-header">
        <h1>Welcome to Tutor Trader</h1>
        <p>
          Set up your profile so we can match you with peers who need your help—
          and those who can help you in return! Select your subjects below.
        </p>
      </header>

      <h2>Let’s Create Your Profile</h2>

      {message && (
        <div className={`form-message ${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />

        <label htmlFor="skills">What can you help others learn?</label>
        <select
          id="skills"
          name="skills"
          multiple
          value={formData.skills}
          onChange={handleMultiSelectChange}
          disabled={isSubmitting}
          required
        >
          {subjectOptions.map(subject => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <label htmlFor="needs">What do you need help with?</label>
        <select
          id="needs"
          name="needs"
          multiple
          value={formData.needs}
          onChange={handleMultiSelectChange}
          disabled={isSubmitting}
          required
        >
          {subjectOptions.map(subject => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Sign Up!"}
        </button>
      </form>

      <p className="redirect-text">
        Already have an account? <Link to="/">Sign in</Link>
      </p>
    </div>
  );
}
