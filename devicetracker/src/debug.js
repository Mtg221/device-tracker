// Simple test to check if React is working
console.log("React app loading...");

// Check if environment variables are accessible
console.log("VITE_CONVEX_URL:", import.meta.env.VITE_CONVEX_URL);
console.log("VITE_CONVEX_SITE_URL:", import.meta.env.VITE_CONVEX_SITE_URL);

// Check if required elements exist
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded");
  const rootElement = document.getElementById('root');
  console.log("Root element:", rootElement);
  
  if (rootElement) {
    console.log("Root element found");
  } else {
    console.error("Root element not found");
  }
});