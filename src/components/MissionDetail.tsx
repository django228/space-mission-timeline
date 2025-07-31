import React, { useState } from 'react';
import { Mission } from '../types/Mission';
import './MissionDetail.css';

interface MissionDetailProps {
  mission: Mission;
  onClose: () => void;
}

const MissionDetail: React.FC<MissionDetailProps> = ({ mission, onClose }) => {
  const [imageError, setImageError] = useState(false);
  const [patchError, setPatchError] = useState(false);

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'launch': return <div className="detail-icon-rocket"></div>;
      case 'landing': return <div className="detail-icon-landing"></div>;
      case 'flyby': return <div className="detail-icon-orbit"></div>;
      case 'orbit': return <div className="detail-icon-satellite"></div>;
      case 'crewed': return <div className="detail-icon-astronaut"></div>;
      case 'sample_return': return <div className="detail-icon-star"></div>;
      default: return <div className="detail-icon-star"></div>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handlePatchError = () => {
    setPatchError(true);
  };

  return (
    <div className="mission-detail-overlay" onClick={onClose}>
      <div className="mission-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <span className="close-icon"></span>
        </button>

        <div className="detail-header">
          <div className="detail-icon">
            {getTypeIcon(mission.type)}
          </div>
          <div className="detail-title-section">
            <h2 className="detail-title">{mission.name}</h2>
            <div className="detail-subtitle">{mission.agency}</div>
          </div>
          {mission.missionPatch && !patchError && (
            <div className="detail-patch">
              <img 
                src={mission.missionPatch} 
                alt={`${mission.name} patch`}
                onError={handlePatchError}
              />
            </div>
          )}
        </div>

        {mission.image && !imageError && (
          <div className="detail-image">
            <img 
              src={mission.image} 
              alt={mission.name}
              onError={handleImageError}
            />
            <div className="image-overlay"></div>
          </div>
        )}

        <div className="detail-content">
          <div className="detail-info-grid">
            <div className="info-item">
              <span className="info-label">Launch Date</span>
              <span className="info-value">{formatDate(mission.date)}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value" style={{ color: getStatusColor(mission.status) }}>
                <div className="status-dot" style={{ backgroundColor: getStatusColor(mission.status) }}></div>
                {getStatusText(mission.status)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Mission Type</span>
              <span className="info-value">{mission.type.charAt(0).toUpperCase() + mission.type.slice(1).replace('_', ' ')}</span>
            </div>

            {mission.rocket && (
              <div className="info-item">
                <span className="info-label">Rocket</span>
                <span className="info-value">{mission.rocket}</span>
              </div>
            )}

            {mission.launchSite && (
              <div className="info-item">
                <span className="info-label">Launch Site</span>
                <span className="info-value">{mission.launchSite}</span>
              </div>
            )}

            {mission.target && (
              <div className="info-item">
                <span className="info-label">Target</span>
                <span className="info-value">{mission.target}</span>
              </div>
            )}

            {mission.success !== undefined && (
              <div className="info-item">
                <span className="info-label">Success</span>
                <span className="info-value" style={{ color: mission.success ? '#4CAF50' : '#F44336' }}>
                  {mission.success ? 'Yes' : 'No'}
                </span>
              </div>
            )}
          </div>

          {mission.crew && mission.crew.length > 0 && (
            <div className="crew-section">
              <h3 className="section-title">Crew Members</h3>
              <div className="crew-list">
                {mission.crew.map((member, index) => (
                  <div key={index} className="crew-member">
                    <div className="crew-avatar"></div>
                    <span className="crew-name">{member}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="description-section">
            <h3 className="section-title">Mission Description</h3>
            <p className="mission-description-text">{mission.description}</p>
          </div>

          {mission.details && mission.details !== mission.description && (
            <div className="details-section">
              <h3 className="section-title">Additional Details</h3>
              <p className="mission-details-text">{mission.details}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;