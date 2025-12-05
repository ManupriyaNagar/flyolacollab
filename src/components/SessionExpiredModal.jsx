"use client";

import { useEffect } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "./AuthContext";

export default function SessionExpiredModal() {
  const { showSessionExpiredModal, setShowSessionExpiredModal, authState } = useAuth();

  // Close modal when user successfully logs in
  useEffect(() => {
    if (authState.isLoggedIn && showSessionExpiredModal) {
      setShowSessionExpiredModal(false);
    }
  }, [authState.isLoggedIn, showSessionExpiredModal, setShowSessionExpiredModal]);

  const handleClose = () => {
    // Don't allow closing without login on booking pages
    const currentPath = window.location.pathname;
    const isOnBookingPage = currentPath.includes('/booking') || 
                           currentPath.includes('/payment') ||
                           currentPath.includes('/scheduled-flight') ||
                           currentPath.includes('/helicopter-flight');
    
    if (!isOnBookingPage) {
      setShowSessionExpiredModal(false);
    }
  };

  const handleSuccess = () => {
    // Modal will close automatically via useEffect when authState updates
    console.log('Login successful, continuing booking...');
  };

  if (!showSessionExpiredModal) return null;

  return (
    <>
      {/* Overlay with message */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-start justify-center pt-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg 
                className="w-8 h-8 text-orange-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Session Expired
            </h2>
            <p className="text-gray-600 mb-4">
              Your session has expired. Please log in again to complete your booking.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <svg 
                  className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900">
                    Don't worry!
                  </p>
                  <p className="text-sm text-blue-700">
                    Your booking details have been saved and will be restored after you log in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showSessionExpiredModal}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </>
  );
}
