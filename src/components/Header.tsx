import React from 'react';
import './Header.css';

interface HeaderProps {
  totalMissions: number;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ totalMissions, isLoading }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-icon">
          <div className="rocket-icon">
            <div className="rocket-body"></div>
            <div className="rocket-flame"></div>
          </div>
        </div>
        <h1 className="header-title">Space Mission Timeline</h1>
        <p className="header-subtitle">
          Explore humanity's journey to the stars
        </p>
        <div className="header-stats">
          {isLoading ? (
            <div className="loading-text">Loading missions...</div>
          ) : (
            <div className="mission-count">
              <span className="count-number">{totalMissions}</span>
              <span className="count-label">missions tracked</span>
            </div>
          )}
        </div>
      </div>
      <div className="stars-background">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </header>
  );
};

export default Header;