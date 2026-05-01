import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Navigation } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from '../supabaseClient'
import './MapTracking.css'

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function MapTracking() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const center = { lat: 14.7167, lng: -17.4677 }

  useEffect(() => {
    fetchDevices()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('devices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => {
        fetchDevices()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  async function fetchDevices() {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('last_update', { ascending: false })
      
      if (error) throw error
      setDevices(data || [])
    } catch (error) {
      console.error('Error fetching devices:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="map-container">Loading devices...</div>
  }

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
              key={device.id}
              position={[device.latitude, device.longitude]}
              icon={icon}
            >
              <Popup>
                <div className="marker-popup">
                  <h3>{device.name || 'Device'}</h3>
                  <p><strong>ID:</strong> {device.device_id}</p>
                  <p><strong>Status:</strong> {device.status}</p>
                  <p><strong>Speed:</strong> {device.speed || 0} km/h</p>
                  <p><strong>Battery:</strong> {device.battery || 0}%</p>
                  <p><strong>Last Update:</strong> {new Date(device.last_update).toLocaleString()}</p>
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
            <div key={device.id} className="device-item">
              <div className="device-info">
                <div className="device-icon">
                  <Navigation size={16} />
                </div>
                <div>
                  <h4>{device.name || 'Device'}</h4>
                  <p className="device-id">{device.device_id}</p>
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
  )
}
