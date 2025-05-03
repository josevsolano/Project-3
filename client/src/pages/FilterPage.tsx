import React, { useEffect, useState } from 'react';
import MatchCard from '../components/MatchCard';
import '../styles/filter.css';
import { useAuth } from '../hooks/useAuth';

interface MatchProfile {
  id: string;
  name: string;
  subjects: string[];
  availability: string;
  bio: string;
}

export default function FilterPage() {
  const { token } = useAuth();
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const matchesPerPage = 4;

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches?page=${page}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch matches (${res.status})`);
      }
      const { results, totalPages: total } = await res.json();
      setMatches(results);
      setTotalPages(total);
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleAddCandidate = async (id: string) => {
    try {
      const res = await fetch(`/api/candidates/${id}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Add failed (${res.status})`);
      await fetchMatches();
    } catch (err: any) {
      console.error('Error adding candidate:', err);
      alert(`Could not add candidate: ${err.message}`);
    }
  };

  const handleRemoveMatch = async (id: string) => {
    try {
      const res = await fetch(`/api/matches/${id}/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Remove failed (${res.status})`);
      await fetchMatches();
    } catch (err: any) {
      console.error('Error removing match:', err);
      alert(`Could not remove match: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <main className="filter-container">
        <p>Loading matches…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="filter-container">
        <p className="error">Error: {error}</p>
        <button onClick={fetchMatches}>Retry</button>
      </main>
    );
  }

  return (
    <main className="filter-container">
      <h2>Your Matches</h2>

      <div className="card-grid">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onAdd={() => handleAddCandidate(match.id)}
            onRemove={() => handleRemoveMatch(match.id)}
          />
        ))}
        {matches.length === 0 && (
          <p className="empty-state">No matches found on this page.</p>
        )}
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          &lt; Prev
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
        >
          Next &gt;
        </button>
      </div>
    </main>
  );
}
