import React from 'react';
import './Header.css';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const stars = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="star"
      style={{
        width: `${Math.random() * 3}px`,
        height: `${Math.random() * 3}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.8 + 0.2,
        animation: `twinkle ${Math.random() * 3 + 2}s infinite`
      }}
    />
  ));
  
  return (
    <div className="header">
      <div className="header-content">
        <h1 className="header-title">🌌 Space Missions</h1>
        <p className="header-subtitle">Exploring the Universe</p>
      </div>
      <div className="stars-container">
        {stars}
      </div>
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Header;