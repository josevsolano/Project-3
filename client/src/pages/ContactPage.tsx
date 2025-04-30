import '../styles/globals.css';
import '../styles/contact.css';

import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Match {
  _id: string;
  requesterId: { email: string };
  subject?: string;
  proposedTime?: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'archived';
  createdAt: string;
}

export default function ContactPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'inbox' | 'scheduled' | 'past'>('inbox');
  const [inbox, setInbox] = useState<Match[]>([]);
  const [scheduled, setScheduled] = useState<Match[]>([]);
  const [past, setPast] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load messages');
        const data = await res.json();
        setInbox(data.inbox);
        setScheduled(data.scheduled);
        setPast(data.past);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const updateMatchStatus = async (matchId: string, action: 'accept' | 'decline' | 'archive') => {
    try {
      const res = await fetch(`/api/messages/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ matchId }),
      });
      if (!res.ok) throw new Error(`${action} failed`);
      setInbox(inbox.filter(m => m._id !== matchId));
      if (action === 'accept') {
        const match = inbox.find(m => m._id === matchId)!;
        setScheduled([{ ...match, status: 'accepted' }, ...scheduled]);
      }
      if (action === 'archive' || action === 'decline') {
        const match = inbox.find(m => m._id === matchId) || scheduled.find(m => m._id === matchId)!;
        setPast([{ ...match, status: action === 'archive' ? 'archived' : 'declined' }, ...past]);
        setScheduled(scheduled.filter(m => m._id !== matchId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = (id: string) => updateMatchStatus(id, 'accept');
  const handleDecline = (id: string) => updateMatchStatus(id, 'decline');
  const handleArchive = (id: string) => updateMatchStatus(id, 'archive');

  if (loading) {
    return <div className="contact-page"><p>Loading sessions…</p></div>;
  }

  const renderCard = (match: Match) => (
    <div className={`contact-card ${match.status}`} key={match._id}>
      {activeTab === 'inbox' && (
        <>
          <p><strong>From:</strong> {match.requesterId.email}</p>
          <p><strong>Subject:</strong> {match.subject}</p>
          <p><strong>Proposed Time:</strong> {match.proposedTime}</p>
          <div className="actions">
            <button onClick={() => handleAccept(match._id)}>Accept</button>
            <button onClick={() => handleDecline(match._id)}>Decline</button>
            <button onClick={() => handleArchive(match._id)}>Archive</button>
          </div>
        </>
      )}
      {activeTab === 'scheduled' && (
        <>
          <p><strong>With:</strong> {match.requesterId.email}</p>
          <p><strong>Topic:</strong> {match.subject}</p>
          <p><strong>Time:</strong> {match.proposedTime}</p>
          <p className="status upcoming">Status: Upcoming</p>
          <button onClick={() => handleArchive(match._id)}>Archive</button>
        </>
      )}
      {activeTab === 'past' && (
        <>
          <p><strong>With:</strong> {match.requesterId.email}</p>
          <p><strong>Status:</strong> {match.status === 'archived' ? 'Archived' : 'Completed/Declined'}</p>
          <p><strong>Time:</strong> {new Date(match.createdAt).toLocaleString()}</p>
          <button className="delete" onClick={() => handleArchive(match._id)}>Delete</button>
        </>
      )}
    </div>
  );

  return (
    <main className="contact-page">
      <h1 className="contact-header">My Contact Sessions</h1>

      <div className="tabs">
        {(['inbox','scheduled','past'] as const).map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'past' ? 'Past / Archived' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <section className="contact-content">
        <div className="card-list">
          {(activeTab === 'inbox' ? inbox
            : activeTab === 'scheduled' ? scheduled
            : past
          ).map(renderCard)}

          {((activeTab === 'inbox' && inbox.length === 0)
            || (activeTab === 'scheduled' && scheduled.length === 0)
            || (activeTab === 'past' && past.length === 0)) && (
            <p className="empty-state">No {activeTab} sessions.</p>
          )}
        </div>
      </section>
    </main>
  );
}
