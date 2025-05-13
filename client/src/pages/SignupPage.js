import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import '../styles/globals.css';
import '../styles/signup.css';
import { useNavigate, Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
const SIGNUP = gql `
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
        skills: [],
        needs: [],
    });
    const [message, setMessage] = useState({
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // clear any existing messages when user edits
        if (message.text)
            setMessage({ text: '', type: '' });
    };
    const handleMultiSelectChange = (e) => {
        const { name } = e.target;
        const values = Array.from(e.target.selectedOptions, (o) => o.value);
        setFormData((prev) => ({ ...prev, [name]: values }));
        if (message.text)
            setMessage({ text: '', type: '' });
    };
    const handleSubmit = (e) => {
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
    return (_jsxs("div", { className: "signup-container fade-in", children: [_jsxs("header", { className: "signup-header", children: [_jsx("h1", { children: "Welcome to Tutor Trader" }), _jsx("p", { children: "Set up your profile so we can match you with peers who need your help \u2014 and those who can help you in return!" })] }), message.text && (_jsx("div", { className: `form-message ${message.type}`, children: message.text })), _jsxs("form", { className: "signup-form", onSubmit: handleSubmit, children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: formData.email, onChange: handleChange, disabled: isSubmitting, required: true }), _jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", value: formData.password, onChange: handleChange, disabled: isSubmitting, required: true }), _jsx("label", { htmlFor: "confirmPassword", children: "Confirm Password" }), _jsx("input", { id: "confirmPassword", name: "confirmPassword", type: "password", value: formData.confirmPassword, onChange: handleChange, disabled: isSubmitting, required: true }), _jsx("label", { htmlFor: "skills", children: "What can you help others learn? Hold shift to select more than one." }), _jsx("select", { id: "skills", name: "skills", multiple: true, value: formData.skills, onChange: handleMultiSelectChange, disabled: isSubmitting, required: true, children: subjectOptions.map((subject) => (_jsx("option", { value: subject, children: subject }, subject))) }), _jsx("label", { htmlFor: "needs", children: "What do you need help with? Hold shift to select more than one." }), _jsx("select", { id: "needs", name: "needs", multiple: true, value: formData.needs, onChange: handleMultiSelectChange, disabled: isSubmitting, required: true, children: subjectOptions.map((subject) => (_jsx("option", { value: subject, children: subject }, subject))) }), _jsx("button", { type: "submit", disabled: isSubmitting, children: isSubmitting ? 'Submitting…' : 'Sign Up!' })] }), _jsxs("p", { className: "redirect-text", children: ["Already have an account? ", _jsx(Link, { to: "/", children: "Sign in" })] })] }));
}
//# sourceMappingURL=SignupPage.js.map