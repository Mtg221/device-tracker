import { NavLink } from "react-router-dom";
import { LayoutDashboard, Map, Settings, History, Users, Shield } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>DeviceTracker</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/devices" className="nav-item">
          <Map size={20} />
          <span>Devices</span>
        </NavLink>
        <NavLink to="/map" className="nav-item">
          <Map size={20} />
          <span>Map Tracking</span>
        </NavLink>
        <NavLink to="/history" className="nav-item">
          <History size={20} />
          <span>History</span>
        </NavLink>
        <NavLink to="/users" className="nav-item">
          <Users size={20} />
          <span>Users & Roles</span>
        </NavLink>
        <NavLink to="/security" className="nav-item">
          <Shield size={20} />
          <span>Security</span>
        </NavLink>
        <NavLink to="/settings" className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
}
