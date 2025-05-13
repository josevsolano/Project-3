import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import '../styles/globals.css';
import '../styles/contact.css';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
const GET_MESSAGES = gql `
  query GetMessages {
    messages {
      _id
      subject
      proposedTime
      status
      createdAt
      requester {
        email
      }
    }
  }
`;
const ACCEPT = gql `
  mutation Accept($id: ID!) {
    accept(id: $id) {
      _id
      status
    }
  }
`;
const DECLINE = gql `
  mutation Decline($id: ID!) {
    decline(id: $id) {
      _id
      status
    }
  }
`;
const ARCHIVE = gql `
  mutation Archive($id: ID!) {
    archive(id: $id) {
      _id
      status
    }
  }
`;
const DELETE_MESSAGE = gql `
  mutation DeleteMessage($id: ID!) {
    deleteMessage(id: $id) {
      _id
    }
  }
`;
export default function ContactPage() {
    const { token } = useAuth();
    const authContext = { headers: { Authorization: `Bearer ${token}` } };
    const { data, loading, error, refetch } = useQuery(GET_MESSAGES, {
        context: authContext,
        fetchPolicy: 'network-only',
    });
    const [accept, { loading: loadingAccept }] = useMutation(ACCEPT, {
        context: authContext,
        refetchQueries: [{ query: GET_MESSAGES }],
        onError: err => console.error('Accept failed:', err),
    });
    const [decline, { loading: loadingDecline }] = useMutation(DECLINE, {
        context: authContext,
        refetchQueries: [{ query: GET_MESSAGES }],
        onError: err => console.error('Decline failed:', err),
    });
    const [archive, { loading: loadingArchive }] = useMutation(ARCHIVE, {
        context: authContext,
        refetchQueries: [{ query: GET_MESSAGES }],
        onError: err => console.error('Archive failed:', err),
    });
    const [deleteMessage, { loading: loadingDelete }] = useMutation(DELETE_MESSAGE, {
        context: authContext,
        refetchQueries: [{ query: GET_MESSAGES }],
        onError: err => console.error('Delete failed:', err),
    });
    const [activeTab, setActiveTab] = useState('inbox');
    if (loading) {
        return (_jsx("main", { className: "contact-page", children: _jsx("p", { children: "Loading sessions\u2026" }) }));
    }
    if (error) {
        return (_jsxs("main", { className: "contact-page", children: [_jsxs("p", { children: ["Error loading messages: ", error.message] }), _jsx("button", { onClick: () => refetch(), children: "Retry" })] }));
    }
    const messages = data.messages;
    const inbox = messages.filter(m => m.status === 'pending');
    const scheduled = messages.filter(m => m.status === 'accepted');
    const past = messages.filter(m => ['declined', 'archived', 'completed'].includes(m.status));
    const renderCard = (m) => {
        const formattedProposed = new Date(m.proposedTime).toLocaleString();
        const formattedCreated = new Date(m.createdAt).toLocaleString();
        return (_jsxs("div", { className: `contact-card ${m.status}`, children: [activeTab === 'inbox' && (_jsxs(_Fragment, { children: [_jsxs("p", { children: [_jsx("strong", { children: "From:" }), " ", m.requester.email] }), _jsxs("p", { children: [_jsx("strong", { children: "Subject:" }), " ", m.subject] }), _jsxs("p", { children: [_jsx("strong", { children: "Proposed Time:" }), " ", formattedProposed] }), _jsxs("p", { children: [_jsx("strong", { children: "Requested At:" }), " ", formattedCreated] }), _jsxs("div", { className: "actions", children: [_jsx("button", { disabled: loadingAccept, onClick: () => accept({ variables: { id: m._id } }), children: "\u2705 Accept" }), _jsx("button", { disabled: loadingDecline, onClick: () => decline({ variables: { id: m._id } }), children: "\u274C Decline" }), _jsx("button", { disabled: loadingArchive, onClick: () => archive({ variables: { id: m._id } }), children: "\uD83D\uDDC4\uFE0F Archive" })] })] })), activeTab === 'scheduled' && (_jsxs(_Fragment, { children: [_jsxs("p", { children: [_jsx("strong", { children: "With:" }), " ", m.requester.email] }), _jsxs("p", { children: [_jsx("strong", { children: "Time:" }), " ", formattedProposed] }), _jsx("p", { className: "status upcoming", children: "Upcoming" }), _jsx("button", { disabled: loadingArchive, onClick: () => archive({ variables: { id: m._id } }), children: "\uD83D\uDDC4\uFE0F Archive" })] })), activeTab === 'past' && (_jsxs(_Fragment, { children: [_jsxs("p", { children: [_jsx("strong", { children: "With:" }), " ", m.requester.email] }), _jsxs("p", { children: [_jsx("strong", { children: "Status:" }), " ", m.status] }), _jsxs("p", { children: [_jsx("strong", { children: "Time:" }), " ", formattedCreated] }), _jsx("button", { className: "delete", disabled: loadingDelete, onClick: () => deleteMessage({ variables: { id: m._id } }), children: "\uD83D\uDDD1\uFE0F Delete" })] }))] }, m._id));
    };
    return (_jsxs("main", { className: "contact-page", children: [_jsx("h1", { className: "contact-header", children: "My Contact Sessions" }), _jsx("div", { className: "tabs", children: ['inbox', 'scheduled', 'past'].map(tab => (_jsx("button", { className: activeTab === tab ? 'active' : '', onClick: () => setActiveTab(tab), children: tab === 'past' ? 'Past / Archived' : tab.charAt(0).toUpperCase() + tab.slice(1) }, tab))) }), _jsx("section", { className: "contact-content", children: _jsxs("div", { className: "card-list", children: [(activeTab === 'inbox'
                            ? inbox
                            : activeTab === 'scheduled'
                                ? scheduled
                                : past).map(renderCard), ((activeTab === 'inbox' && inbox.length === 0)
                            || (activeTab === 'scheduled' && scheduled.length === 0)
                            || (activeTab === 'past' && past.length === 0)) && (_jsxs("p", { className: "empty-state", children: ["No ", activeTab, " sessions."] }))] }) })] }));
}
//# sourceMappingURL=ContactPage.js.map