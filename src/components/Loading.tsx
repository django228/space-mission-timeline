import React from 'react';
import './Loading.css';

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="rocket-loader">
          <div className="rocket-body-loader"></div>
          <div className="rocket-flame-loader"></div>
        </div>
        <div className="loading-text">
          <span>Loading missions</span>
          <div className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
      <div className="loading-stars">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="loading-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;