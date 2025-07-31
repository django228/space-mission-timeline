import React, { useState, memo, useMemo } from 'react';
import { Mission } from '../types/Mission';
import './MissionCard.css';

interface MissionCardProps {
  mission: Mission;
  isSelected: boolean;
  onClick: () => void;
}

const MissionCard: React.FC<MissionCardProps> = memo(({ mission, isSelected, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [patchError, setPatchError] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'launch': return <div className="card-icon-rocket"></div>;
      case 'landing': return <div className="card-icon-landing"></div>;
      case 'flyby': return <div className="card-icon-orbit"></div>;
      case 'orbit': return <div className="card-icon-satellite"></div>;
      case 'crewed': return <div className="card-icon-astronaut"></div>;
      case 'sample_return': return <div className="card-icon-star"></div>;
      default: return <div className="card-icon-star"></div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'ongoing': return '#2196F3';
      case 'planned': return '#FF9800';
      case 'failed': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'ongoing': return 'Ongoing';
      case 'planned': return 'Planned';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  const memoizedValues = useMemo(() => ({
    statusColor: getStatusColor(mission.status),
    statusText: getStatusText(mission.status),
    typeIcon: getTypeIcon(mission.type),
    formattedDate: new Date(mission.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }), [mission.status, mission.type, mission.date]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handlePatchError = () => {
    setPatchError(true);
  };

  return (
    <div className={`mission-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className="mission-marker" style={{ backgroundColor: memoizedValues.statusColor }}>
        {memoizedValues.typeIcon}
      </div>
      
      <div className="mission-content">
        {mission.image && !imageError && (
          <div className="mission-image">
            <img 
              src={mission.image} 
              alt={mission.name} 
              loading="lazy"
              onError={handleImageError}
            />
          </div>
        )}
        
        <div className="mission-header">
          <div className="mission-date">{memoizedValues.formattedDate}</div>
          <h3 className="mission-name">{mission.name}</h3>
          <div className="mission-agency">{mission.agency}</div>
        </div>

        <div className="mission-body">
          <p className="mission-description">{mission.description}</p>
          
          <div className="mission-details">
            {mission.rocket && (
              <div className="detail-item">
                <span className="detail-label">Rocket:</span>
                <span className="detail-value">{mission.rocket}</span>
              </div>
            )}
            
            {mission.target && (
              <div className="detail-item">
                <span className="detail-label">Target:</span>
                <span className="detail-value">{mission.target}</span>
              </div>
            )}
            
            {mission.launchSite && (
              <div className="detail-item">
                <span className="detail-label">Launch Site:</span>
                <span className="detail-value">{mission.launchSite}</span>
              </div>
            )}
            
            {mission.crew && mission.crew.length > 0 && (
              <div className="detail-item">
                <span className="detail-label">Crew:</span>
                <span className="detail-value">{mission.crew.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mission-footer">
          <div className="mission-status" style={{ color: memoizedValues.statusColor }}>
            <div className="status-indicator" style={{ backgroundColor: memoizedValues.statusColor }}></div>
            {memoizedValues.statusText}
          </div>
          
          {mission.missionPatch && !patchError && (
            <div className="mission-patch">
              <img 
                src={mission.missionPatch} 
                alt={`${mission.name} patch`}
                onError={handlePatchError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MissionCard.displayName = 'MissionCard';

export default MissionCard;