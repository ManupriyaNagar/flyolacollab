import { use } from "react";
import EditHotelClient from "./EditHotelClient";

// Note: With output: 'export', only hotels that exist at build time will have pages
// New hotels added after deployment won't have edit pages until you rebuild

// Generate static params for all hotels
export async function generateStaticParams() {
  // For static export, we need to return at least one ID
  // If API is unavailable, return placeholder IDs
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      return [{ id: '1' }];
    }
    
    // Fetch all hotels to generate static pages
    const response = await fetch(`${apiUrl}/api/v1/hotels`, {
      cache: 'no-store',
      // Add timeout to prevent hanging during build
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      return [{ id: '1' }];
    }
    
    const data = await response.json();
    const hotels = data.data || [];
    
    if (hotels.length === 0) {
      return [{ id: '1' }];
    }
    
    // Return array of params objects with id
    return hotels.map((hotel) => ({
      id: hotel.id.toString(),
    }));
  } catch (error) {
    // Return placeholder ID if fetch fails
    return [{ id: '1' }];
  }
}

// Server component wrapper
export default function EditHotelPage({ params }) {
  // Unwrap params Promise using React.use() (Next.js 15 requirement)
  const { id } = use(params);
  
  return <EditHotelClient id={id} />;
}