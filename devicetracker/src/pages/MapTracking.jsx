import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./MapTracking.css";

const icon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapTracking() {
  const [devices, setDevices] = useState([
    {
      deviceId: "TRACK001",
      name: "Vehicle Alpha",
      status: "running",
      latitude: 14.7167,
      longitude: -17.4677,
      speed: 45,
      battery: 87,
    },
    {
      deviceId: "TRACK002",
      name: "Vehicle Beta",
      status: "idle",
      latitude: 14.6937,
      longitude: -17.4441,
      speed: 0,
      battery: 62,
    },
    {
      deviceId: "TRACK003",
      name: "Vehicle Gamma",
      status: "running",
      latitude: 14.6939,
      longitude: -17.4440,
      speed: 32,
      battery: 94,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prev) =>
        prev.map((device) => ({
          ...device,
          latitude: device.latitude + (Math.random() - 0.5) * 0.01,
          longitude: device.longitude + (Math.random() - 0.5) * 0.01,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const center = { lat: 14.7167, lng: -17.4677 };

  return (
    <div className="map-container">
      <div className="map-wrapper">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {devices.map((device) => (
            <Marker
              key={device.deviceId}
              position={[device.latitude, device.longitude]}
              icon={icon}
            >
              <Popup>
                <div className="marker-popup">
                  <h3>{device.name}</h3>
                  <p>
                    <strong>ID:</strong> {device.deviceId}
                  </p>
                  <p>
                    <strong>Status:</strong> {device.status}
                  </p>
                  <p>
                    <strong>Speed:</strong> {device.speed} km/h
                  </p>
                  <p>
                    <strong>Battery:</strong> {device.battery}%
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="devices-sidebar">
        <div className="sidebar-header">
          <h2>Live Devices</h2>
          <span className="count">{devices.length} active</span>
        </div>
        <div className="devices-list">
          {devices.map((device) => (
            <div key={device.deviceId} className="device-item">
              <div className="device-info">
                <div className="device-icon">
                  <Navigation size={16} />
                </div>
                <div>
                  <h4>{device.name}</h4>
                  <p className="device-id">{device.deviceId}</p>
                </div>
              </div>
              <div className="device-status">
                <span className={`status-dot status-${device.status}`}></span>
                <span className="status-text">{device.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
