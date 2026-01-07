"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ProfessionalTicket from "../../components/SingleTicket/ProfessionalTicket";

// Loading component for Suspense fallback
const GetTicketLoadingFallback = () => (
  <div style={{
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    paddingTop: "80px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  }}>
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
      padding: "24px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}>
      <div style={{
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: "2px solid #e2e8f0",
        borderTopColor: "#1e40af",
        animation: "spin 1s linear infinite"
      }} />
      <p style={{
        fontSize: "14px",
        fontWeight: "500",
        color: "#475569"
      }}>
        Loading ticket page...
      </p>
    </div>
  </div>
);

// Main content component that uses useSearchParams
const GetTicketContent = () => {
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchMethod, setSearchMethod] = useState("pnr");
  const [pnr, setPnr] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("id");
  const pnrParam = searchParams.get("pnr");

  useEffect(() => {
    if (bookingId || pnrParam) {
      fetchTicketData(bookingId || pnrParam);
    }
  }, [bookingId, pnrParam]);

  const fetchTicketData = async (identifier) => {
    try {
      setLoading(true);
      setError(null);

      // Use the tickets endpoint for better data formatting
      const url = `${BASE_URL}/tickets/get-ticket?pnr=${encodeURIComponent(identifier)}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Failed to fetch ticket data: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || "No booking found for this PNR");
      }


      // The backend already returns properly formatted data, use it directly
      const ticketData = result.data;
      const booking = ticketData.booking;
      const flight = ticketData.flight;
      const passengers = ticketData.passengers || [];
      const payment = ticketData.payment || {};
      const seats = ticketData.seats || {};

      // Debug logging to identify the issue
      console.log('Flight data:', {
        departureCode: flight.departureCode,
        arrivalCode: flight.arrivalCode,
        departure: flight.departure,
        arrival: flight.arrival,
        seatDetails: seats.details
      });

      const formattedData = {
        bookingData: {
          id: booking.id,
          departure: flight.departure,
          arrival: flight.arrival,
          // Use backend airport codes directly - no fallback to name truncation
          departureCode: flight.departureCode || 'DEP',
          arrivalCode: flight.arrivalCode || 'ARR',
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          selectedDate: flight.selectedDate,
          totalPrice: flight.totalPrice,
          bookDate: booking.bookDate,
          flightId: flight.id,
          flightNumber: flight.flightNumber,
          helicopterNumber: flight.helicopterNumber,
          bookedSeats: seats.labels || 'Not Assigned',
          bookingType: flight.bookingType || 'flight' // Add bookingType from backend
        },
        travelerDetails: passengers.map((passenger, index) => ({
          title: passenger.title || "Mr",
          fullName: passenger.fullName || passenger.name || "Passenger",
          dateOfBirth: passenger.dateOfBirth,
          email: passenger.email || booking.email_id || "contact@flyolaindia.com",
          phone: passenger.phone || booking.contact_no || "+91-9876543210",
          address: passenger.address || "",
          // Use actual seat label from backend
          seat: passenger.seat || seats.details?.[index]?.label || 'Not Assigned'
        })),
        bookingResult: {
          booking: {
            pnr: booking.pnr,
            bookingNo: booking.bookingNo,
            bookDate: booking.bookDate,
            paymentStatus: booking.paymentStatus || "COMPLETED",
            bookingStatus: booking.bookingStatus || "CONFIRMED",
            totalFare: booking.totalFare,
            noOfPassengers: booking.noOfPassengers,
            contact_no: booking.contact_no,
            email_id: booking.email_id,
            // Use actual seat labels from backend
            bookedSeats: seats.details?.map(seat => seat.label) || []
          },
          passengers: passengers.map((passenger, index) => ({
            age: passenger.age || "25",
            type: passenger.type || "Adult",
            name: passenger.name || passenger.fullName,
            title: passenger.title,
            // Use actual seat label from backend
            seat: passenger.seat || seats.details?.[index]?.label || 'Not Assigned'
          })),
          payment: {
            status: payment.status || booking.paymentStatus || "COMPLETED",
            amount: payment.amount || booking.totalFare
          }
        }
      };

      setTicketData(formattedData);
    } catch (err) {
      setError(err.message || "Failed to load ticket data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (searchMethod === "pnr") {
        if (!pnr.trim()) {
          throw new Error("Please enter a valid PNR number");
        }
        router.push(`/get-ticket?pnr=${pnr.trim()}`);
      } else {
        if (!fullName.trim() || !email.trim()) {
          throw new Error("Please enter both name and email");
        }
        // Here you would implement the name/email search
        // For now, we'll just show an error
        throw new Error("Name and email search is not implemented yet");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: "#f9fafb",
      minHeight: "100vh",
      paddingTop: "80px",
      paddingBottom: "80px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {!ticketData ? (
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 24px"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.03)",
            overflow: "hidden",
            border: "1px solid #e5e7eb"
          }}>
            {/* Header */}
            <div style={{
              background: "#1e293b",
              padding: "32px 40px",
              position: "relative",
              borderBottom: "1px solid #334155"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/logoo-04.png"
                    alt="FlyOla Logo"
                    width={48}
                    height={48}
                    style={{ marginRight: "16px" }}
                  />
                  <div>
                    <h1 style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "white",
                      margin: 0
                    }}>
                      Booking Inquiry
                    </h1>
                    <p style={{
                      fontSize: "14px",
                      color: "#94a3b8",
                      margin: "4px 0 0 0"
                    }}>
                      Check your flight or helicopter booking details
                    </p>
                  </div>
                </div>
                <div style={{
                  backgroundColor: "#334155",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: "500"
                }}>
                  Ticket Management
                </div>
              </div>
            </div>

            {/* Search Form */}
            <div style={{ padding: "40px" }}>
              <div style={{ marginBottom: "32px" }}>
                <h2 style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#334155",
                  margin: "0 0 8px 0"
                }}>
                  Retrieve Your Booking
                </h2>
                <p style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: 0
                }}>
                  Enter your booking details to view and download your ticket.
                </p>
              </div>

              {error && (
                <div style={{
                  backgroundColor: "#fef2f2",
                  color: "#991b1b",
                  padding: "12px 16px",
                  borderRadius: "4px",
                  marginBottom: "24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #fee2e2"
                }}>
                  <span style={{
                    marginRight: "12px",
                    fontWeight: "700"
                  }}>!</span>
                  {error}
                </div>
              )}

              <div style={{
                display: "flex",
                borderBottom: "1px solid #e5e7eb",
                marginBottom: "32px"
              }}>
                <button
                  onClick={() => setSearchMethod("pnr")}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "transparent",
                    color: searchMethod === "pnr" ? "#0f172a" : "#64748b",
                    border: "none",
                    borderBottom: searchMethod === "pnr" ? "2px solid #0f172a" : "none",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    marginRight: "16px"
                  }}
                >
                  Search By PNR
                </button>
                <button
                  onClick={() => setSearchMethod("name-email")}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "transparent",
                    color: searchMethod === "name-email" ? "#0f172a" : "#64748b",
                    border: "none",
                    borderBottom: searchMethod === "name-email" ? "2px solid #0f172a" : "none",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Name and Email
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {searchMethod === "pnr" ? (
                  <div>
                    <label
                      htmlFor="pnr"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#475569"
                      }}
                    >
                      PNR Number
                    </label>
                    <input
                      type="text"
                      id="pnr"
                      value={pnr}
                      onChange={(e) => setPnr(e.target.value)}
                      placeholder="Enter your PNR number"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "14px",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "white",
                        marginBottom: "24px",
                        outline: "none",
                        transition: "all 0.2s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#6b7280"}
                      onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        padding: "10px 16px",
                        backgroundColor: "#1e40af",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: submitting ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        opacity: submitting ? 0.7 : 1
                      }}
                      onMouseOver={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#1e3a8a")}
                      onMouseOut={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#1e40af")}
                    >
                      {submitting ? "Searching..." : "Search Ticket"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        htmlFor="fullName"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#475569"
                        }}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          fontSize: "14px",
                          borderRadius: "4px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "white",
                          outline: "none",
                          transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#6b7280"}
                        onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                      />
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                      <label
                        htmlFor="email"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#475569"
                        }}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          fontSize: "14px",
                          borderRadius: "4px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "white",
                          outline: "none",
                          transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#6b7280"}
                        onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        padding: "10px 16px",
                        backgroundColor: "#1e40af",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: submitting ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        opacity: submitting ? 0.7 : 1
                      }}
                      onMouseOver={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#1e3a8a")}
                      onMouseOut={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#1e40af")}
                    >
                      {submitting ? "Searching..." : "Search Ticket"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh"
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "24px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "2px solid #e2e8f0",
                  borderTopColor: "#1e40af",
                  animation: "spin 1s linear infinite"
                }} />
                <p style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#475569"
                }}>
                  Loading ticket information...
                </p>
                <style jsx global>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px"
              }}>
                <h2 style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#0f172a",
                  margin: 0
                }}>
                  {ticketData.bookingData?.bookingType === 'helicopter' ? 'Helicopter' : 'Flight'} Ticket Details
                </h2>
                <button
                  onClick={() => {
                    setTicketData(null);
                    router.push("/get-ticket");
                  }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #e2e8f0",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#e2e8f0";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#f1f5f9";
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Search
                </button>
              </div>

              <ProfessionalTicket
                bookingData={ticketData.bookingData}
                travelerDetails={ticketData.travelerDetails}
                bookingResult={ticketData.bookingResult}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Main component with Suspense boundary
const GetTicketPage = () => {
  return (
    <Suspense fallback={<GetTicketLoadingFallback />}>
      <GetTicketContent />
    </Suspense>
  );
};

export default GetTicketPage;