import { Suspense } from "react";
import HotelsPageClient from "./HotelsPageClient";

export default function HotelsPage() {
  return (
    <Suspense    fallback={
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Sidebar Skeleton */}
            <aside className="hidden md:block w-[260px] flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border p-4 space-y-6 animate-pulse">
                <div className="h-10 bg-gray-200 rounded-lg"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </aside>

            {/* Main Content Skeleton */}
            <div className="flex-1 space-y-4">
              {/* Header Skeleton */}
              <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>

              {/* Hotel Cards Skeleton */}
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
                  <div className="flex flex-col md:flex-row">
                    {/* Image Skeleton */}
                    <div className="md:w-80 h-48 md:h-56 bg-gray-200"></div>
                    
                    {/* Content Skeleton */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:justify-between h-full">
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                        
                        {/* Price Skeleton */}
                        <div className="md:w-48 md:text-right mt-4 md:mt-0 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
                          <div className="h-8 bg-gray-200 rounded w-32 ml-auto"></div>
                          <div className="h-4 bg-gray-200 rounded w-24 ml-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }
  >
      <HotelsPageClient />
    </Suspense>
  );
}
