
import { Suspense } from "react";
import HotelDetailsClient from "./HotelDetailsClient";

// Generate static params for static export
export async function generateStaticParams() {
  const hotelIds = ['1', '2', '3', '4', '5']; 
  
  return hotelIds.map((id) => ({
    id: id,
  }));
}

export default function HotelDetailsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <HotelDetailsClient />
    </Suspense>
  );
}