import { useState, useEffect } from "react";

export default function TestPage() {
  const [status, setStatus] = useState("Loading...");
  
  useEffect(() => {
    // Check if environment variables are loaded
    const convexUrl = import.meta.env.VITE_CONVEX_URL;
    const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;
    
    if (convexUrl && convexSiteUrl) {
      setStatus("Environment variables loaded successfully");
    } else {
      setStatus("Environment variables not found");
    }
    
    // Check if DOM is loaded
    console.log("Test page loaded");
  }, []);
  
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>DeviceTracker Test Page</h1>
      <p>Status: {status}</p>
      <p>If you can see this page, the React app is working correctly.</p>
      <p>If you're still seeing a blank page, there might be an issue with routing or environment variables.</p>
    </div>
  );
}