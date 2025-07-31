import React, { memo, useCallback } from 'react';
import { Mission } from '../types/Mission';
import MissionCard from './MissionCard';
import './Timeline.css';

interface TimelineProps {
  missions: Mission[];
  selectedMission: Mission | null;
  onMissionSelect: (mission: Mission) => void;
}

const Timeline: React.FC<TimelineProps> = memo(({ missions, selectedMission, onMissionSelect }) => {
  const handleMissionSelect = useCallback((mission: Mission) => {
    onMissionSelect(mission);
  }, [onMissionSelect]);

  return (
    <div className="timeline-container">
      <div className="timeline">
        <div className="timeline-line"></div>
        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            isSelected={selectedMission?.id === mission.id}
            onClick={() => handleMissionSelect(mission)}
          />
        ))}
      </div>
    </div>
  );
});

Timeline.displayName = 'Timeline';

export default Timeline;