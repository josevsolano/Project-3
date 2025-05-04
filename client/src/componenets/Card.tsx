import React from 'react';
import '../styles/card.css'; // Ensure you have a CSS file for styling

// Define the props type for the Card component
interface CardProps {
  name: string;
  email: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ name, email, description }) => {
  return (
    <div className="card">
      <h2 className="card-name">{name}</h2>
      <p className="card-email"><strong>Email:</strong> {email}</p>
      <p className="card-description">{description}</p>
    </div>
  );
};

export default Card;