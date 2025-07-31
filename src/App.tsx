import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Mission } from './types/Mission';
import { SpaceApiService } from './services/spaceApi';
import Header from './components/Header';
import MissionFilters from './components/MissionFilters';
import Timeline from './components/Timeline';
import MissionDetail from './components/MissionDetail';
import Loading from './components/Loading';
import './App.css';

const App: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAgency, setFilterAgency] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadMissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let missions: Mission[] = [];
      
      try {
        const spacexMissions = await SpaceApiService.fetchSpaceXLaunches(15);
        missions = [...missions, ...spacexMissions];
      } catch (apiError) {
      }
      
      const fallbackMissions = SpaceApiService.getFallbackMissions();
      missions = [...missions, ...fallbackMissions];
      
      const uniqueMissions = missions.filter((mission, index, self) => 
        index === self.findIndex(m => m.id === mission.id)
      );
      
      const sortedMissions = uniqueMissions.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setMissions(sortedMissions);
    } catch (err) {
      const fallbackMissions = SpaceApiService.getFallbackMissions();
      setMissions(fallbackMissions);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const filteredMissions = useMemo(() => {
    let filtered = missions;

    if (filterType !== 'all') {
      filtered = filtered.filter(mission => mission.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(mission => mission.status === filterStatus);
    }

    if (filterAgency !== 'all') {
      filtered = filtered.filter(mission => mission.agency === filterAgency);
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(mission =>
        mission.name.toLowerCase().includes(searchLower) ||
        mission.description.toLowerCase().includes(searchLower) ||
        mission.agency.toLowerCase().includes(searchLower) ||
        mission.rocket?.toLowerCase().includes(searchLower) ||
        mission.target?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [missions, filterType, filterStatus, filterAgency, searchTerm]);

  const handleMissionSelect = useCallback((mission: Mission) => {
    setSelectedMission(mission);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedMission(null);
  }, []);

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={loadMissions} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header totalMissions={missions.length} isLoading={isLoading} />
      
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <MissionFilters
            missions={missions}
            filterType={filterType}
            filterStatus={filterStatus}
            filterAgency={filterAgency}
            searchTerm={searchTerm}
            onFilterTypeChange={setFilterType}
            onFilterStatusChange={setFilterStatus}
            onFilterAgencyChange={setFilterAgency}
            onSearchChange={setSearchTerm}
          />

          {filteredMissions.length === 0 ? (
            <div className="no-results">
              <div className="no-results-content">
                <div className="no-results-icon">🔍</div>
                <h3>No missions found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            </div>
          ) : (
            <Timeline
              missions={filteredMissions}
              selectedMission={selectedMission}
              onMissionSelect={handleMissionSelect}
            />
          )}

          {selectedMission && (
            <MissionDetail
              mission={selectedMission}
              onClose={handleCloseDetail}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;