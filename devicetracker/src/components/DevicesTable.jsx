import { useState } from "react";
import { Search } from "lucide-react";
import StatusBadge from "./StatusBadge";
import "./DevicesTable.css";

export default function DevicesTable({ devices = [], onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.deviceId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || device.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="devices-table-container">
      <div className="table-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="running">Running</option>
          <option value="idle">Idle</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <table className="devices-table">
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Location</th>
            <th>Speed</th>
            <th>Battery</th>
            <th>Last Update</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-data">
                No devices found
              </td>
            </tr>
          ) : (
            filteredDevices.map((device) => (
              <tr key={device.deviceId || device._id}>
                <td>{device.deviceId}</td>
                <td>{device.name}</td>
                <td>
                  <StatusBadge status={device.status} />
                </td>
                <td>
                  {device.latitude?.toFixed(4)}, {device.longitude?.toFixed(4)}
                </td>
                <td>{device.speed ? `${device.speed} km/h` : "-"}</td>
                <td>{device.battery ? `${device.battery}%` : "-"}</td>
                <td>{formatDate(device.lastUpdate)}</td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => onEdit?.(device)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete?.(device)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(timestamp) {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  return date.toLocaleString();
}
