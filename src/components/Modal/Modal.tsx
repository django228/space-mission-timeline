import './Modal.css';
import { MissionType } from '../../types/MissionType';

interface ModalProps {
  mission: MissionType | null;
  onClose: () => void;
}

function Modal({ mission, onClose }: ModalProps) {
  if (!mission) return null;
  
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-button"
          onClick={onClose}
        >
          ×
        </button>
        
        <h2 className="modal-title">
          {mission.name}
        </h2>

        {mission.links?.flickr?.original?.[0] && (
          <img
            src={mission.links.flickr.original[0]}
            alt={`${mission.name} mission image`}
            className="modal-image"
          />
        )}
        
        {mission.links?.patch?.small && !mission.links?.flickr?.original?.[0] && !mission.links?.webcast && (
          <img
            src={mission.links.patch.small}
            alt={`${mission.name} patch`}
            className="mission-patch"
          />
        )}
        
        <div className="modal-details">
          <p><strong>Date:</strong> {mission.date_utc ? new Date(mission.date_utc).toLocaleDateString() : 'Unknown'}</p>
          <p><strong>Status:</strong> <span className={mission.success ? 'modal-status-success' : 'modal-status-failed'}>
            {mission.success ? 'Success' : 'Failed'}
          </span></p>
          <p><strong>Description:</strong> {mission.details || 'No description available'}</p>
        </div>
      </div>
    </div>
  );
}

export default Modal;