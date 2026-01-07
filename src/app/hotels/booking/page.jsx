import { Suspense } from "react";
import HotelBookingClient from "./HotelBookingClient";

export default function HotelBookingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <HotelBookingClient />
    </Suspense>
  );
}
