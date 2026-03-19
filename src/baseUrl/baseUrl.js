// Base URL configuration for different services

// Node.js backend (existing flight services)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://app.jetserveaviation.com";

// Go backend (hotel services)
const GO_BASE_URL = process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080";

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('Node.js API URL:', BASE_URL);
  console.log('Go API URL:', GO_BASE_URL);
}

export default BASE_URL;
export { GO_BASE_URL };
