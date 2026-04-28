import { useState } from "react";
import "./Settings.css";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    autoRefresh: true,
    soundAlerts: false,
    darkMode: false,
    emailReports: true,
    gpsTracking: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      <div className="settings-section">
        <h2>Notifications</h2>
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">Push Notifications</span>
            <span className="setting-description">
              Receive real-time alerts for device events
            </span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => toggleSetting("notifications")}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">Sound Alerts</span>
            <span className="setting-description">
              Play sound for critical alerts
            </span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.soundAlerts}
              onChange={() => toggleSetting("soundAlerts")}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>Tracking</h2>
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">GPS Tracking</span>
            <span className="setting-description">
              Enable real-time GPS location updates
            </span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.gpsTracking}
              onChange={() => toggleSetting("gpsTracking")}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">Auto Refresh</span>
            <span className="setting-description">
              Automatically refresh device data
            </span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.autoRefresh}
              onChange={() => toggleSetting("autoRefresh")}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>Reports</h2>
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">Email Reports</span>
            <span className="setting-description">
              Receive daily summary reports via email
            </span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.emailReports}
              onChange={() => toggleSetting("emailReports")}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
