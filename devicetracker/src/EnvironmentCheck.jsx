import { useState, useEffect } from "react";

export default function EnvironmentCheck() {
  const [envStatus, setEnvStatus] = useState({
    convexUrl: "Not loaded",
    convexSiteUrl: "Not loaded",
    status: "Checking..."
  });
  
  useEffect(() => {
    try {
      // Check environment variables
      const convexUrl = import.meta.env.VITE_CONVEX_URL;
      const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;
      
      console.log("VITE_CONVEX_URL:", convexUrl);
      console.log("VITE_CONVEX_SITE_URL:", convexSiteUrl);
      
      setEnvStatus({
        convexUrl: convexUrl ? "Loaded" : "Not found",
        convexSiteUrl: convexSiteUrl ? "Loaded" : "Not found",
        status: "Environment variables check complete"
      });
    } catch (error) {
      console.error("Error checking environment variables:", error);
      setEnvStatus(prev => ({
        ...prev,
        status: "Error checking environment variables: " + error.message
      }));
    }
  }, []);
  
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Environment Variables Check</h2>
      <p><strong>Status:</strong> {envStatus.status}</p>
      <p><strong>VITE_CONVEX_URL:</strong> {envStatus.convexUrl}</p>
      <p><strong>VITE_CONVEX_SITE_URL:</strong> {envStatus.convexSiteUrl}</p>
      <p><strong>NODE_ENV:</strong> {import.meta.env.NODE_ENV}</p>
      <p><strong>PROD:</strong> {import.meta.env.PROD ? "true" : "false"}</p>
      <p><strong>DEV:</strong> {import.meta.env.DEV ? "true" : "false"}</p>
    </div>
  );
}