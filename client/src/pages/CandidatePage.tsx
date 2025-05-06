import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import '../styles/candidate.css';
import { useAuth } from '../hooks/useAuth';

const GET_CANDIDATE = gql`
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

const GET_VIEWER = gql`
  query GetViewer {
    me {
      id
      skills
    }
  }
`;

const SEND_REQUEST = gql`
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
  const { id } = useParams<{ id: string }>();

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
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [messageText, setMessageText] = useState('');
  const [feedback, setFeedback] = useState('');

  if (cdLoading || vLoading) return <p>Loading profile…</p>;
  if (cdError) return <p>Error loading profile: {cdError.message}</p>;

  const candidate = cdData.user;
  const viewerSkills: string[] = vData?.me?.skills || [];

  const sharedStrengths = candidate.needs.filter((need: string) =>
    viewerSkills.includes(need)
  );

  const toggleSlot = (slot: string) => {
    setSelectedSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
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
    } catch (err: any) {
      console.error(err);
      setFeedback(`❌ ${err.message}`);
    }
  };

  return (
    <main className="candidate-page">
      <h1>{candidate.name}</h1>
      <p className="timezone">Timezone: {candidate.timezone}</p>
      <p className="bio">{candidate.bio}</p>

      <div className="tags">
        <div>
          <h3>Can Tutor:</h3>
          {candidate.skills.map((s: string) => (
            <span key={s} className="tag skill">{s}</span>
          ))}
        </div>
        <div>
          <h3>Needs Help With:</h3>
          {candidate.needs.map((n: string) => (
            <span key={n} className="tag need">{n}</span>
          ))}
        </div>
      </div>

      {sharedStrengths.length > 0 && (
        <div className="shared-section">
          <h3>You Can Help With:</h3>
          <div className="shared-tags">
            {sharedStrengths.map((s: string) => (
              <span key={s} className="tag shared">{s}</span>
            ))}
          </div>
        </div>
      )}

      <button className="contact-button" onClick={() => setShowModal(true)}>
        Contact
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="contact-modal">
            <h2>Send a Tutoring Request</h2>

            <textarea
              placeholder="Write your message…"
              value={messageText}
              onChange={e => {
                setMessageText(e.target.value);
                setFeedback('');
              }}
            />

            <h3>Select Available Times ({candidate.timezone})</h3>
            <div className="schedule-grid">
              {daysOfWeek.map(day => (
                <div key={day} className="day-column">
                  <strong>{day}</strong>
                  {hours.map(({ value, label }) => {
                    const slot = `${day}-${value}`;
                    const isSelected = selectedSlots.includes(slot);
                    const isAvailable = candidate.availability.includes(slot);
                    return (
                      <button
                        key={slot}
                        disabled={!isAvailable || sending}
                        className={`slot ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleSlot(slot)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {feedback && <p className="form-feedback">{feedback}</p>}

            <div className="modal-actions">
              <button disabled={sending} onClick={handleSend}>
                {sending ? 'Sending…' : 'Send Request'}
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
