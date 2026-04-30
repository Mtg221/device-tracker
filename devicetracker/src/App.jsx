import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DevicesPage from "./pages/Devices";
import MapTracking from "./pages/MapTracking";
import Settings from "./pages/Settings";
import OtherPages, { Users, Security } from "./pages/OtherPages";
import "./index.css";
import { ConvexProviderWrapper } from "./convexClient";

export default function App() {
  return (
    <ConvexProviderWrapper>
      <BrowserRouter>
        <div className="app">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/map" element={<MapTracking />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/history" element={<OtherPages />} />
              <Route path="/users" element={<Users />} />
              <Route path="/security" element={<Security />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ConvexProviderWrapper>
  );
}
