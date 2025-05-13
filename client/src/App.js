import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import FilterPage from './pages/FilterPage';
import CandidatePage from './pages/CandidatePage';
import ContactPage from './pages/ContactPage';
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignupPage, {}) }), _jsx(Route, { path: "/filter", element: _jsx(FilterPage, {}) }), _jsx(Route, { path: "/candidate/:id", element: _jsx(CandidatePage, {}) }), _jsx(Route, { path: "/contact", element: _jsx(ContactPage, {}) })] }));
}
//# sourceMappingURL=App.js.map