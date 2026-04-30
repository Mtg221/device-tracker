import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MapPin, Activity, AlertCircle, CheckCircle } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Dashboard.css";

export default function Dashboard() {
  const devices = useQuery(api.devices.getAll) || [];
  
  const stats = {
    total: devices.length,
    running: devices.filter((d) => d.status === "running").length,
    idle: devices.filter((d) => d.status === "idle").length,
    offline: devices.filter((d) => d.status === "offline").length,
  };
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Device Tracker Dashboard</h1>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <MapPin size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Devices</span>
          </div>
        </div>
        <div className="stat-card running">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.running}</span>
            <span className="stat-label">Running</span>
          </div>
        </div>
        <div className="stat-card idle">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.idle}</span>
            <span className="stat-label">Idle</span>
          </div>
        </div>
        <div className="stat-card offline">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.offline}</span>
            <span className="stat-label">Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
}