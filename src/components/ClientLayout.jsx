"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthContext";
import RouteProtection from "@/components/RouteProtection";
import SessionExpiredModal from "@/components/SessionExpiredModal";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Check for all dashboard routes
  const isDashboard =
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/user-dashboard") ||
    pathname.startsWith("/agent-dashboard") ||
    pathname.startsWith("/head-admin-dashboard") ||
    pathname.startsWith("/chairman-admin-dashboard") ||
    pathname.startsWith("/director-admin-dashboard") ||
    pathname.startsWith("/accounts-admin-dashboard") ||
    pathname.startsWith("/operations-dashboard") ||
    pathname.startsWith("/mp-tourism-portal");

  return (
    <AuthProvider>
      <RouteProtection>
        {/* Show Header for non-dashboard pages */}
        {!isDashboard && <Header />}

        {/* Main content, adding padding only if not on a dashboard */}
        <main className={!isDashboard ? "pt-20" : ""}>
          {children}
        </main>

        {/* Show Footer for non-dashboard pages */}
        {!isDashboard && <Footer />}
      </RouteProtection>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Session Expired Modal */}
      <SessionExpiredModal />
    </AuthProvider>
  );
}
