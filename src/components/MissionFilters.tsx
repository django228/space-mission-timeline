import React from 'react';
import { Mission } from '../types/Mission';
import './MissionFilters.css';

interface MissionFiltersProps {
  missions: Mission[];
  filterType: string;
  filterStatus: string;
  filterAgency: string;
  searchTerm: string;
  onFilterTypeChange: (type: string) => void;
  onFilterStatusChange: (status: string) => void;
  onFilterAgencyChange: (agency: string) => void;
  onSearchChange: (term: string) => void;
}

const MissionFilters: React.FC<MissionFiltersProps> = ({
  missions,
  filterType,
  filterStatus,
  filterAgency,
  searchTerm,
  onFilterTypeChange,
  onFilterStatusChange,
  onFilterAgencyChange,
  onSearchChange
}) => {
  const agencies = Array.from(new Set(missions.map(m => m.agency))).sort();
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'launch': return <div className="icon-rocket"></div>;
      case 'landing': return <div className="icon-landing"></div>;
      case 'flyby': return <div className="icon-orbit"></div>;
      case 'orbit': return <div className="icon-satellite"></div>;
      case 'crewed': return <div className="icon-astronaut"></div>;
      case 'sample_return': return <div className="icon-star"></div>;
      default: return <div className="icon-star"></div>;
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

  return (
    <div className="mission-filters">
      <div className="filters-container">
        <div className="search-container">
          <div className="search-icon"></div>
          <input
            type="text"
            placeholder="Search missions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Mission Type</label>
          <select 
            value={filterType} 
            onChange={(e) => onFilterTypeChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="launch">Launch</option>
            <option value="landing">Landing</option>
            <option value="flyby">Flyby</option>
            <option value="orbit">Orbit</option>
            <option value="crewed">Crewed</option>
            <option value="sample_return">Sample Return</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select 
            value={filterStatus} 
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
            <option value="planned">Planned</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Agency</label>
          <select 
            value={filterAgency} 
            onChange={(e) => onFilterAgencyChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Agencies</option>
            {agencies.map(agency => (
              <option key={agency} value={agency}>{agency}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-stats">
        <div className="stats-grid">
          {['launch', 'landing', 'flyby', 'orbit', 'crewed', 'sample_return'].map(type => {
            const count = missions.filter(m => m.type === type).length;
            return count > 0 ? (
              <div key={type} className="stat-item">
                {getTypeIcon(type)}
                <span className="stat-count">{count}</span>
                <span className="stat-label">{type.replace('_', ' ')}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default MissionFilters;