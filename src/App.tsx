import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Timeline from './components/Timeline/Timeline';
import Modal from './components/Modal/Modal';
import { MissionType } from './types/MissionType';
import './App.css';

const App: React.FC = () => {
  const [missions, setMissions] = useState<MissionType[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMission, setSelectedMission] = useState<MissionType | null>(null);

  useEffect(() => {
    fetch('https://api.spacexdata.com/v4/launches')
      .then(response => response.json())
      .then(data => {
        setMissions(data.slice(0, 200));
        setLoading(false);
      })
      .catch(error => {
        console.log('Error:', error);
        setLoading(false);
      });
  }, []);

  const filtered = missions.filter(mission =>
    mission.name && mission.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div style={{ textAlign: 'center', padding: '50px', color: '#ccc' }}>
          <p>Loading missions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <input
          type="text"
          placeholder="Search missions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            margin: '20px 0',
            backgroundColor: '#1a1a2e',
            border: '1px solid #44',
            borderRadius: '6px',
            color: 'white',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
        />
        
        <p style={{ color: '#4ecdc4', textAlign: 'center' }}>
          Missions found: {filtered.length}
        </p>
        
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#ccc' }}>
            <p>No missions found</p>
          </div>
        ) : (
          <Timeline
            missions={filtered}
            selectedMission={selectedMission ? selectedMission.id : null}
            onMissionClick={setSelectedMission}
          />
        )}
      </div>
      
      <Modal
        mission={selectedMission}
        onClose={() => setSelectedMission(null)}
      />
    </div>
  );
};

export default App;