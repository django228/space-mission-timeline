import React from 'react';
import { Mission } from '../types/Mission';
import MissionCard from './MissionCard';
import './Timeline.css';

interface TimelineProps {
  missions: Mission[];
  selectedMission: Mission | null;
  onMissionSelect: (mission: Mission) => void;
}

const Timeline: React.FC<TimelineProps> = ({ missions, selectedMission, onMissionSelect }) => {
  return (
    <div className="timeline-container">
      <div className="timeline">
        <div className="timeline-line"></div>
        {missions.map((mission, index) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            isSelected={selectedMission?.id === mission.id}
            onClick={() => onMissionSelect(mission)}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;