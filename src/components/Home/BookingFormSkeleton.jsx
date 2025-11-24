"use client";

export default function BookingFormSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-1">
        {/* From Skeleton */}
        <div className="relative flex flex-col rounded-sm border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="h-4 bg-gray-200 rounded w-12 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>

        {/* To Skeleton */}
        <div className="relative flex flex-col rounded-sm border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="h-4 bg-gray-200 rounded w-8 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>

        {/* Departure Date Skeleton */}
        <div className="relative flex flex-col rounded-sm border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="flex items-baseline gap-2">
            <div className="h-10 w-12 bg-gray-200 rounded"></div>
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-16 mt-2"></div>
        </div>

        {/* Return Date Skeleton */}
        <div className="relative flex flex-col rounded-sm border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
          <div className="h-14 bg-gray-200 rounded w-full"></div>
        </div>

        {/* Travellers & Class Skeleton */}
        <div className="relative flex flex-col rounded-sm border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="h-4 bg-gray-200 rounded w-28 mb-3"></div>
          <div className="flex items-baseline gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-16 mt-2"></div>
        </div>
      </div>
    </div>
  );
}
