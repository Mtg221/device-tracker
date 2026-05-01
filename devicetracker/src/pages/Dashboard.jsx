import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { MapPin, Activity, AlertCircle, CheckCircle } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Dashboard.css";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDevices();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('devices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => {
        fetchDevices();
      })
      .subscribe();
    
    return () => {
      channel.unsubscribe();
    };
  }, []);
  
  async function fetchDevices() {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('last_update', { ascending: false });
      
      if (error) throw error;
      setDevices(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setLoading(false);
    }
  }
  
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