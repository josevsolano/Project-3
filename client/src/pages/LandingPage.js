import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import '../styles/globals.css';
import '../styles/landing.css';
import { useNavigate, Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
// // const GET_SPLASH = gql`
// //   query GetSplash {
// //     landingPage {
// //       message
// //     }
// //   }
// // `;
const LOGIN = gql `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;
export default function LandingPage() {
    const navigate = useNavigate();
    const { loggedIn, setToken } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMsg, setLoginMsg] = useState({
        text: '',
        type: '',
    });
    // const {
    //   data: splashData,
    //   loading: splashLoading,
    //   error: splashError,
    //   refetch: refetchSplash,
    // } = useQuery(GET_SPLASH, {
    //   fetchPolicy: 'cache-first',
    // });
    const [login, { loading: loggingIn, error: loginError }] = useMutation(LOGIN, {
        onCompleted: ({ login: { token } }) => {
            localStorage.setItem('token', token);
            setToken(token);
            setLoginMsg({ text: '✅ Sign‑in successful! Redirecting…', type: 'success' });
            setTimeout(() => navigate('/filter'), 800);
        },
        onError: (err) => {
            setLoginMsg({ text: `❌ ${err.message}`, type: 'error' });
        },
    });
    useEffect(() => {
        if (loggedIn) {
            navigate('/filter');
        }
    }, [loggedIn, navigate]);
    // if (splashLoading) {
    //   return (
    //     <main className="container">
    //       <p>Loading…</p>
    //     </main>
    //   );
    // }
    // if (splashError) {
    //   return (
    //     <main className="container">
    //       <p>Error loading splash: {splashError.message}</p>
    //       <button onClick={() => refetchSplash()}>Retry</button>
    //     </main>
    //   );
    // }
    // const splashMessage = splashData?.landingPage.message ?? '“We all gain knowledge from each other.”';
    const handleScrollToForm = () => {
        const el = document.getElementById('auth-form');
        if (!el)
            return;
        el.scrollIntoView({ behavior: 'smooth' });
        el.classList.add('bounce');
        setTimeout(() => el.classList.remove('bounce'), 800);
    };
    const handleLogin = (e) => {
        e.preventDefault();
        setLoginMsg({ text: '', type: '' });
        if (!email.trim() || !password) {
            setLoginMsg({ text: '❌ Please enter both email and password.', type: 'error' });
            return;
        }
        login({ variables: { email: email.trim(), password } });
    };
    return (_jsxs("div", { className: "container", children: [_jsx("section", { className: "landing-hero fade-in", children: _jsxs("div", { className: "landing-cta", children: [_jsx("h1", { className: "landing-title", children: "T\u2011eachother!" }), _jsx("button", { onClick: handleScrollToForm, children: "Get Started" })] }) }), _jsxs("section", { className: "mission fade-in", children: [_jsxs("h2", { children: ["Welcome to ", _jsx("em", { children: "Tutor Trader" })] }), _jsxs("p", { children: ["At ", _jsx("em", { children: "Tutor Trader" }), ", we believe every student has knowledge to share and room to grow. Our platform connects learners of all backgrounds to teach, learn, and build confidence together."] })] }), _jsxs("section", { className: "impact fade-in", children: [_jsx("h3", { children: "The Power of Tutoring" }), _jsxs("ul", { children: [_jsx("li", { children: "High\u2011impact tutoring is 20\u00D7 more effective for math and 15\u00D7 for reading." }), _jsx("li", { children: "Students using tutoring services saw a 7% higher success rate. \u2013 SBVC" })] }), _jsx("h3", { children: "Interpersonal & Academic Success" }), _jsx("ul", { children: _jsx("li", { children: "Strong peer relationships boost grades and well\u2011being. \u2013 PMC, ERIC" }) }), _jsx("h3", { children: "Collaboration & Career Growth" }), _jsxs("ul", { children: [_jsx("li", { children: "Peer tutoring fosters empathy, communication, and teamwork." }), _jsx("li", { children: "Collaborative learning leads to better outcomes. \u2013 OCL studies" })] })] }), _jsxs("section", { id: "auth-form", className: "auth-form fade-in", children: [_jsx("h2", { children: "Join the Community of Fellow Students" }), loginMsg.text && (_jsx("div", { className: `form-message ${loginMsg.type}`, children: loginMsg.text })), loginError && (_jsx("div", { className: "form-message error", children: loginError.message })), _jsxs("form", { onSubmit: handleLogin, children: [_jsx("label", { htmlFor: "login-email", children: "Email" }), _jsx("input", { id: "login-email", type: "email", value: email, onChange: e => setEmail(e.target.value), disabled: loggingIn, required: true }), _jsx("label", { htmlFor: "login-password", children: "Password" }), _jsx("input", { id: "login-password", type: "password", value: password, onChange: e => setPassword(e.target.value), disabled: loggingIn, required: true }), _jsx("button", { type: "submit", disabled: loggingIn, children: loggingIn ? 'Signing In…' : 'Sign In' })] }), _jsxs("h3", { children: ["Not a member yet? ", _jsx(Link, { to: "/signup", children: "Start Here!" })] })] })] }));
}
//# sourceMappingURL=LandingPage.js.map