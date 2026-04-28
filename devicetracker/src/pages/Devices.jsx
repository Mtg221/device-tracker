import { useState } from "react";
import DevicesTable from "../components/DevicesTable";
import Header from "../components/Header";
import "./Devices.css";

export default function DevicesPage() {
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
  ]);

  return (
    <div className="devices-page">
      <Header onAddDevice={() => console.log("Add device")} />
      <div className="devices-content">
        <h1>Devices</h1>
        <DevicesTable devices={devices} />
      </div>
    </div>
  );
}
