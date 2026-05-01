import { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';
import DevicesTable from "../components/DevicesTable";
import Header from "../components/Header";
import "./Devices.css";

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
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('last_update', { ascending: false });
    
    if (error) {
      console.error('Error fetching devices:', error);
      return;
    }
    
    setDevices(data || []);
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
    
    setDevices(data || []);
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
    
    setDevices(data || []);
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
