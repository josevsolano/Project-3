import '../styles/globals.css';
import '../styles/contact.css';
import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';

const GET_MESSAGES = gql`
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

const ACCEPT = gql`mutation Accept($id: ID!) { accept(id: $id) { _id status } }`;
const DECLINE = gql`mutation Decline($id: ID!) { decline(id: $id) { _id status } }`;
const ARCHIVE = gql`mutation Archive($id: ID!) { archive(id: $id) { _id status } }`;

export default function ContactPage() {
  const { token } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_MESSAGES, {
    context: { headers: { Authorization: `Bearer ${token}` } }
  });
  const [accept] = useMutation(ACCEPT, { onCompleted: () => refetch() });
  const [decline] = useMutation(DECLINE, { onCompleted: () => refetch() });
  const [archive] = useMutation(ARCHIVE, { onCompleted: () => refetch() });

  const [activeTab, setActiveTab] = React.useState<'inbox'|'scheduled'|'past'>('inbox');

  if (loading) return <main className="contact-page"><p>Loading sessions…</p></main>;
  if (error)   return <main className="contact-page"><p>Error: {error.message}</p></main>;

  const inbox    = data.messages.filter((m: any) => m.status === 'pending');
  const scheduled= data.messages.filter((m: any) => m.status === 'accepted');
  const past     = data.messages.filter((m: any) =>
    ['declined','archived','completed'].includes(m.status)
  );

  const renderCard = (m: any) => (
    <div className={`contact-card ${m.status}`} key={m._id}>
      {activeTab === 'inbox' && (
        <>
          <p><strong>From:</strong> {m.requester.email}</p>
          <p><strong>Subject:</strong> {m.subject}</p>
          <p><strong>Proposed Time:</strong> {m.proposedTime}</p>
          <div className="actions">
            <button onClick={() => accept({ variables: { id: m._id } })}>Accept</button>
            <button onClick={() => decline({ variables: { id: m._id } })}>Decline</button>
            <button onClick={() => archive({ variables: { id: m._id } })}>Archive</button>
          </div>
        </>
      )}
      {activeTab === 'scheduled' && (
        <>
          <p><strong>With:</strong> {m.requester.email}</p>
          <p><strong>Time:</strong> {m.proposedTime}</p>
          <p className="status upcoming">Upcoming</p>
          <button onClick={() => archive({ variables: { id: m._id } })}>Archive</button>
        </>
      )}
      {activeTab === 'past' && (
        <>
          <p><strong>With:</strong> {m.requester.email}</p>
          <p><strong>Status:</strong> {m.status}</p>
          <p><strong>Time:</strong> {new Date(m.createdAt).toLocaleString()}</p>
          <button className="delete" onClick={() => archive({ variables: { id: m._id } })}>
            Delete
          </button>
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
          {((activeTab === 'inbox' && !inbox.length)
            || (activeTab === 'scheduled' && !scheduled.length)
            || (activeTab === 'past' && !past.length)) && (
            <p className="empty-state">No {activeTab} sessions.</p>
          )}
        </div>
      </section>
    </main>
  );
}
