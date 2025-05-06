import React, { useState } from 'react';
import '../styles/globals.css';
import '../styles/signup.css';
import { useNavigate, Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';

const SIGNUP = gql`
  mutation Signup(
    $email: String!
    $password: String!
    $skills: [String!]!
    $needs: [String!]!
  ) {
    signup(
      email: $email
      password: $password
      skills: $skills
      needs: $needs
    ) {
      token
    }
  }
`;

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

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({
    text: '',
    type: '',
  });

  const [signup, { loading: isSubmitting }] = useMutation(SIGNUP, {
    onCompleted: ({ signup: { token } }) => {
      localStorage.setItem('token', token);
      setToken(token);
      setMessage({ text: '✅ Signup successful! Redirecting…', type: 'success' });
      setTimeout(() => navigate('/filter'), 1000);
    },
    onError: (err) => {
      setMessage({ text: `❌ ${err.message}`, type: 'error' });
    },
  });

  const subjectOptions = [
    "Math", "Science", "English", "History",
    "Spanish", "Computer Science", "Art",
    "Music", "Writing", "Medical", "Psychology",
    "Economics", "Business", "Philosophy",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear any existing messages when user edits
    if (message.text) setMessage({ text: '', type: '' });
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name } = e.target;
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((prev) => ({ ...prev, [name]: values }));
    if (message.text) setMessage({ text: '', type: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const { email, password, confirmPassword, skills, needs } = formData;

    if (!email.trim() || !password) {
      setMessage({ text: '❌ Email and password are required.', type: 'error' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ text: "❌ Passwords don't match.", type: 'error' });
      return;
    }
    if (skills.length === 0 || needs.length === 0) {
      setMessage({ text: '❌ Please select at least one skill and one need.', type: 'error' });
      return;
    }

    signup({
      variables: {
        email: email.trim(),
        password,
        skills,
        needs,
      },
    });
  };

  return (
    <div className="signup-container fade-in">
      <header className="signup-header">
        <h1>Welcome to Tutor Trader</h1>
        <p>
          Set up your profile so we can match you with peers who need your help — and those who can
          help you in return!
        </p>
      </header>

      {message.text && (
        <div className={`form-message ${message.type}`}>{message.text}</div>
      )}

      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />

        <label htmlFor="skills">What can you help others learn? Hold shift to select more than one.</label>
        <select
          id="skills"
          name="skills"
          multiple
          value={formData.skills}
          onChange={handleMultiSelectChange}
          disabled={isSubmitting}
          required
        >
          {subjectOptions.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <label htmlFor="needs">What do you need help with? Hold shift to select more than one.</label>
        <select
          id="needs"
          name="needs"
          multiple
          value={formData.needs}
          onChange={handleMultiSelectChange}
          disabled={isSubmitting}
          required
        >
          {subjectOptions.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Sign Up!'}
        </button>
      </form>

      <p className="redirect-text">
        Already have an account? <Link to="/">Sign in</Link>
      </p>
    </div>
  );
}
