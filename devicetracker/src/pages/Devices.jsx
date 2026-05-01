import { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';
import DevicesTable from "../components/DevicesTable";
import Header from "../components/Header";
import "./Devices.css";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  async function fetchDevices() {
    setLoading(true);
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('last_update', { ascending: false });

    setLoading(false);

    if (error) {
      console.error('Error fetching devices:', error);
      return;
    }

    setDevices(data || []);
  }

  if (loading) {
    return <div>Loading...</div>;
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
