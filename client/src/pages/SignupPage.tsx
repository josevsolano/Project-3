import '../styles/globals.css';
import '../styles/signup.css';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function SignupPage() {
    const navigate = useNavigate();

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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, selectedOptions } = e.target;
        const values = Array.from(selectedOptions, option => option.value);
        setFormData({ ...formData, [name]: values });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous message
        setMessage('');
        setMessageType('');

        if (formData.password !== formData.confirmPassword) {
            setMessage("❌ Passwords don't match.");
            setMessageType('error');
            console.error("Signup failed: Passwords don't match.");
            return;
        }

        if (!formData.email || !formData.password || formData.skills.length === 0 || formData.needs.length === 0) {
            setMessage("❌ All fields are required.");
            setMessageType('error');
            console.warn("Signup failed: Missing fields.");
            return;
        }

        setMessage("✅ Signup successful! Redirecting...");
        setMessageType('success');
        setIsSubmitting(true);
        console.log("Signup successful:", formData);

        setTimeout(() => {
            navigate('/filter');
        }, 1000);
    };

    return (
        <div className="signup-container fade-in">
            <header className="signup-header">
                <h1>Welcome to Tutor Trader</h1>
                <p>
                    Set up your profile so we can match you with peers who need your help — and those who can help you in return!
                    Select the subjects you're good at, what you’d like help with, and you’re all set!
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
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                />

                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                <label htmlFor="skills">What can you help others learn?</label>
                <select
                    id="skills"
                    name="skills"
                    multiple
                    value={formData.skills}
                    onChange={handleMultiSelectChange}
                    required
                >
                    {subjectOptions.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>

                <label htmlFor="needs">What do you need help with?</label>
                <select
                    id="needs"
                    name="needs"
                    multiple
                    value={formData.needs}
                    onChange={handleMultiSelectChange}
                    required
                >
                    {subjectOptions.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Sign Up!"}
                </button>
            </form>

            <p className="redirect-text">
                Already have an account?{' '}
                <Link to="/">Sign in</Link>
            </p>
        </div>
    );
}
