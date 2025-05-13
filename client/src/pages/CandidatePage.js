import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import '../styles/candidate.css';
import { useAuth } from '../hooks/useAuth';
const GET_CANDIDATE = gql `
  query GetCandidate($id: ID!) {
    user(id: $id) {
      id
      name
      bio
      timezone            # e.g. "America/Denver"
      skills
      needs
      availability        # e.g. ["Sun-0","Sun-1",...,"Sat-23"]
    }
  }
`;
const GET_VIEWER = gql `
  query GetViewer {
    me {
      id
      skills
    }
  }
`;
const SEND_REQUEST = gql `
  mutation SendRequest($toId: ID!, $message: String!, $times: [String!]!) {
    sendMessage(toId: $toId, message: $message, proposedTimes: $times) {
      _id
    }
  }
`;
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 24 }, (_, i) => {
    const hour12 = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? 'AM' : 'PM';
    return { value: i, label: `${hour12} ${period}` };
});
export default function CandidatePage() {
    const { token } = useAuth();
    const { id } = useParams();
    const { data: cdData, loading: cdLoading, error: cdError } = useQuery(GET_CANDIDATE, {
        variables: { id },
        context: { headers: { Authorization: `Bearer ${token}` } },
        fetchPolicy: 'network-only',
    });
    const { data: vData, loading: vLoading } = useQuery(GET_VIEWER, {
        context: { headers: { Authorization: `Bearer ${token}` } },
    });
    const [sendMessage, { loading: sending }] = useMutation(SEND_REQUEST, {
        context: { headers: { Authorization: `Bearer ${token}` } },
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [feedback, setFeedback] = useState('');
    if (cdLoading || vLoading)
        return _jsx("p", { children: "Loading profile\u2026" });
    if (cdError)
        return _jsxs("p", { children: ["Error loading profile: ", cdError.message] });
    const candidate = cdData.user;
    const viewerSkills = vData?.me?.skills || [];
    const sharedStrengths = candidate.needs.filter((need) => viewerSkills.includes(need));
    const toggleSlot = (slot) => {
        setSelectedSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]);
        setFeedback('');
    };
    const handleSend = async () => {
        if (!messageText.trim() || selectedSlots.length === 0) {
            setFeedback('❌ Please include a message and select at least one time.');
            return;
        }
        try {
            await sendMessage({
                variables: {
                    toId: id,
                    message: messageText.trim(),
                    times: selectedSlots,
                },
            });
            setFeedback('✅ Request sent!');
            setTimeout(() => setShowModal(false), 1000);
        }
        catch (err) {
            console.error(err);
            setFeedback(`❌ ${err.message}`);
        }
    };
    return (_jsxs("main", { className: "candidate-page", children: [_jsx("h1", { children: candidate.name }), _jsxs("p", { className: "timezone", children: ["Timezone: ", candidate.timezone] }), _jsx("p", { className: "bio", children: candidate.bio }), _jsxs("div", { className: "tags", children: [_jsxs("div", { children: [_jsx("h3", { children: "Can Tutor:" }), candidate.skills.map((s) => (_jsx("span", { className: "tag skill", children: s }, s)))] }), _jsxs("div", { children: [_jsx("h3", { children: "Needs Help With:" }), candidate.needs.map((n) => (_jsx("span", { className: "tag need", children: n }, n)))] })] }), sharedStrengths.length > 0 && (_jsxs("div", { className: "shared-section", children: [_jsx("h3", { children: "You Can Help With:" }), _jsx("div", { className: "shared-tags", children: sharedStrengths.map((s) => (_jsx("span", { className: "tag shared", children: s }, s))) })] })), _jsx("button", { className: "contact-button", onClick: () => setShowModal(true), children: "Contact" }), showModal && (_jsx("div", { className: "modal-overlay", children: _jsxs("div", { className: "contact-modal", children: [_jsx("h2", { children: "Send a Tutoring Request" }), _jsx("textarea", { placeholder: "Write your message\u2026", value: messageText, onChange: e => {
                                setMessageText(e.target.value);
                                setFeedback('');
                            } }), _jsxs("h3", { children: ["Select Available Times (", candidate.timezone, ")"] }), _jsx("div", { className: "schedule-grid", children: daysOfWeek.map(day => (_jsxs("div", { className: "day-column", children: [_jsx("strong", { children: day }), hours.map(({ value, label }) => {
                                        const slot = `${day}-${value}`;
                                        const isSelected = selectedSlots.includes(slot);
                                        const isAvailable = candidate.availability.includes(slot);
                                        return (_jsx("button", { disabled: !isAvailable || sending, className: `slot ${isSelected ? 'selected' : ''}`, onClick: () => toggleSlot(slot), children: label }, slot));
                                    })] }, day))) }), feedback && _jsx("p", { className: "form-feedback", children: feedback }), _jsxs("div", { className: "modal-actions", children: [_jsx("button", { disabled: sending, onClick: handleSend, children: sending ? 'Sending…' : 'Send Request' }), _jsx("button", { onClick: () => setShowModal(false), children: "Cancel" })] })] }) }))] }));
}
//# sourceMappingURL=CandidatePage.js.map