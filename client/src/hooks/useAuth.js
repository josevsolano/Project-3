import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const loggedIn = Boolean(token);
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };
    return (_jsx(AuthContext.Provider, { value: { loggedIn, token, setToken, logout }, children: children }));
};
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}
//# sourceMappingURL=useAuth.js.map