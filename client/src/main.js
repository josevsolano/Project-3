import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import './styles/globals.css';
import App from './App';
import { AuthProvider } from './hooks/useAuth';
import client from './graphql/client';
import './app.css';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(ApolloProvider, { client: client, children: _jsx(AuthProvider, { children: _jsx(App, {}) }) }) }) }));
//# sourceMappingURL=main.js.map