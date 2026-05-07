import { SENEGAL_REGIONS } from '../data/regions'
import '../styles/fleet.css'

export default function RegionSelector({ onSelect, selectedRegion }) {
  return (
    <div className="regions-container">
      <div className="section-header">
        <p className="section-label">Choose Location</p>
        <h2 className="section-title">Select a Region</h2>
      </div>
      
      <div className="regions-grid">
        {SENEGAL_REGIONS.map(region => (
          <div 
            key={region.id}
            className={`region-card ${selectedRegion === region.id ? 'selected' : ''}`}
            onClick={() => onSelect(region.id)}
          >
            <div className="region-icon">📍</div>
            <h3 className="region-name">{region.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
