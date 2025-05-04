import React, { useState } from 'react';
import '../styles/globals.css';
import '../styles/contact.css';
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

const ACCEPT = gql`
  mutation Accept($id: ID!) {
    accept(id: $id) {
      _id
      status
    }
  }
`;

const DECLINE = gql`
  mutation Decline($id: ID!) {
    decline(id: $id) {
      _id
      status
    }
  }
`;

const ARCHIVE = gql`
  mutation Archive($id: ID!) {
    archive(id: $id) {
      _id
      status
    }
  }
`;

const DELETE_MESSAGE = gql`
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

  const [accept,  { loading: loadingAccept  }] = useMutation(ACCEPT, {
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

  const [activeTab, setActiveTab] = useState<'inbox'|'scheduled'|'past'>('inbox');

  if (loading) {
    return (
      <main className="contact-page">
        <p>Loading sessions…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="contact-page">
        <p>Error loading messages: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </main>
    );
  }

  const messages = data.messages as any[];
  const inbox     = messages.filter(m => m.status === 'pending');
  const scheduled = messages.filter(m => m.status === 'accepted');
  const past      = messages.filter(m =>
    ['declined','archived','completed'].includes(m.status)
  );

  const renderCard = (m: any) => {
    const formattedProposed = new Date(m.proposedTime).toLocaleString();
    const formattedCreated  = new Date(m.createdAt).toLocaleString();

    return (
      <div className={`contact-card ${m.status}`} key={m._id}>
        {activeTab === 'inbox' && (
          <>
            <p><strong>From:</strong> {m.requester.email}</p>
            <p><strong>Subject:</strong> {m.subject}</p>
            <p><strong>Proposed Time:</strong> {formattedProposed}</p>
            <p><strong>Requested At:</strong> {formattedCreated}</p>
            <div className="actions">
              <button
                disabled={loadingAccept}
                onClick={() => accept({ variables: { id: m._id } })}
              >✅ Accept</button>
              <button
                disabled={loadingDecline}
                onClick={() => decline({ variables: { id: m._id } })}
              >❌ Decline</button>
              <button
                disabled={loadingArchive}
                onClick={() => archive({ variables: { id: m._id } })}
              >🗄️ Archive</button>
            </div>
          </>
        )}
        {activeTab === 'scheduled' && (
          <>
            <p><strong>With:</strong> {m.requester.email}</p>
            <p><strong>Time:</strong> {formattedProposed}</p>
            <p className="status upcoming">Upcoming</p>
            <button
              disabled={loadingArchive}
              onClick={() => archive({ variables: { id: m._id } })}
            >🗄️ Archive</button>
          </>
        )}
        {activeTab === 'past' && (
          <>
            <p><strong>With:</strong> {m.requester.email}</p>
            <p><strong>Status:</strong> {m.status}</p>
            <p><strong>Time:</strong> {formattedCreated}</p>
            <button
              className="delete"
              disabled={loadingDelete}
              onClick={() => deleteMessage({ variables: { id: m._id } })}
            >🗑️ Delete</button>
          </>
        )}
      </div>
    );
  };

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
          {(activeTab === 'inbox'
            ? inbox
            : activeTab === 'scheduled'
              ? scheduled
              : past
          ).map(renderCard)}

          {((activeTab === 'inbox'     && inbox.length === 0)
           || (activeTab === 'scheduled' && scheduled.length === 0)
           || (activeTab === 'past'      && past.length === 0)) && (
            <p className="empty-state">No {activeTab} sessions.</p>
          )}
        </div>
      </section>
    </main>
  );
}
