import React from 'react';
import { MissionType } from '../../types/MissionType';
import Mission from '../Mission/Mission';
import './Timeline.css';

interface TimelineProps {
  missions: MissionType[];
  selectedMission: string | null;
  onMissionClick: (mission: MissionType) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  missions,
  selectedMission,
  onMissionClick
}) => {
  return (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      
      {missions.map((mission, index) => (
        <div
          key={mission.id}
          className={`mission-wrapper ${index % 2 === 0 ? 'left' : 'right'}`}
        >
          <Mission
            mission={mission}
            isSelected={selectedMission === mission.id}
            onClick={() => onMissionClick(mission)}
            position={index % 2 === 0 ? 'left' : 'right'}
          />
        </div>
      ))}
      <div className="clearfix"></div>
    </div>
  );
};

export default Timeline;