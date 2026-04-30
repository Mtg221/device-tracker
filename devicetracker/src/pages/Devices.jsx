import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DevicesTable from "../components/DevicesTable";
import Header from "../components/Header";
import "./Devices.css";

export default function DevicesPage() {
  const devices = useQuery(api.devices.getAll);

  if (devices === undefined) {
    return <div>Loading devices...</div>;
  }

  if (devices === null) {
    return <div>Error loading devices</div>;
  }

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
