// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.jetserveaviation.com      ";

// Only log in development
if (process.env.NODE_ENV === 'development') {
}

export default BASE_URL;