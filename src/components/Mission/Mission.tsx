import React from 'react';
import { MissionType } from '../../types/MissionType';
import './Mission.css';

interface MissionProps {
  mission: MissionType;
  isSelected: boolean;
  onClick: () => void;
  position: 'left' | 'right';
}

const Mission: React.FC<MissionProps> = ({
  mission,
  isSelected,
  onClick,
  position
}) => {
  return (
    <div
      className={`mission-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className={`mission-marker ${position} ${isSelected ? 'selected' : ''}`}></div>
      
      {mission.links?.flickr?.original?.[0] && (
        <img
          src={mission.links.flickr.original[0]}
          alt={`${mission.name} mission image`}
          className="mission-image"
        />
      )}
      
      <h3 className="mission-title">
        {mission.name || 'Unnamed Mission'}
      </h3>
      
      {mission.links?.patch?.small && !mission.links?.flickr?.original?.[0] && (
        <img
          src={mission.links.patch.small}
          alt={`${mission.name} patch`}
          className="mission-image"
        />
      )}
      
      <p className="mission-date">
        Date: {mission.date_utc ? new Date(mission.date_utc).toLocaleDateString() : 'Unknown'}
      </p>
      <p className={`mission-status ${mission.success ? 'success' : 'failed'}`}>
        Status: {mission.success ? 'Success' : 'Failed'}
      </p>
      <p className="mission-description">
        {mission.details ? mission.details.substring(0, 100) + '...' : 'No description available'}
      </p>
    </div>
  );
};

export default Mission;