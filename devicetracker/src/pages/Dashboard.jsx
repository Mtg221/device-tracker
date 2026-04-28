import { useState } from "react";
import { MapPin, Activity, AlertCircle, CheckCircle } from "lucide-react";
import DevicesTable from "../components/DevicesTable";
import Header from "../components/Header";
import "./Dashboard.css";

export default function Dashboard() {
  const [devices] = useState([
    {
      deviceId: "TRACK001",
      name: "Vehicle Alpha",
      status: "running",
      latitude: 14.7167,
      longitude: -17.4677,
      speed: 45,
      battery: 87,
      lastUpdate: Date.now(),
    },
    {
      deviceId: "TRACK002",
      name: "Vehicle Beta",
      status: "idle",
      latitude: 14.6937,
      longitude: -17.4441,
      speed: 0,
      battery: 62,
      lastUpdate: Date.now(),
    },
    {
      deviceId: "TRACK003",
      name: "Vehicle Gamma",
      status: "running",
      latitude: 14.6939,
      longitude: -17.4440,
      speed: 32,
      battery: 94,
      lastUpdate: Date.now(),
    },
    {
      deviceId: "TRACK004",
      name: "Vehicle Delta",
      status: "offline",
      latitude: 14.6939,
      longitude: -17.4440,
      speed: 0,
      battery: 15,
      lastUpdate: Date.now() - 3600000,
    },
  ]);

  const stats = {
    total: devices.length,
    running: devices.filter((d) => d.status === "running").length,
    idle: devices.filter((d) => d.status === "idle").length,
    offline: devices.filter((d) => d.status === "offline").length,
  };

  return (
    <div className="dashboard">
      <Header onAddDevice={() => console.log("Add device")} />

      <div className="dashboard-content">
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

        <h2 className="section-title">All Devices</h2>
        <DevicesTable devices={devices} />
      </div>
    </div>
  );
}
