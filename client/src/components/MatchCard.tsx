import React from 'react';
import '../styles/card.css';

export interface MatchProfile {
  id: string;
  name: string;
  email: string;
  description: string;
  strengths: string[];
  needs: string[];
}

interface MatchCardProps {
  match: MatchProfile;
  onAdd: () => Promise<void>;
  onRemove: () => Promise<void>;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onAdd,
  onRemove,
}) => (
  <div className="card">
    <h2 className="card-name">{match.name}</h2>
    <p className="card-email"><strong>Email:</strong> {match.email}</p>
    <p className="card-description">{match.description}</p>
    <div className="card-tags">
      <strong>Strengths:</strong> {match.strengths.join(', ')}
    </div>
    <div className="card-tags">
      <strong>Needs:</strong> {match.needs.join(', ')}
    </div>
    <button onClick={onAdd}>Add</button>
    <button onClick={onRemove}>Remove</button>
  </div>
);

export default MatchCard;
