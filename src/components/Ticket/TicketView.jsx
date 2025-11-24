/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useRef } from "react";
import {
  FaPlane,
  FaClock,
  FaUserFriends,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDownload,
  FaInfoCircle,
  FaLuggageCart,
  FaExclamationTriangle,
} from "react-icons/fa";

const TicketView = ({ isOpen, onClose, booking, isDownload = false }) => {
  const ticketRef = useRef(null);

  if (!booking) return null;

  // Construct bookingData with robust fallbacks
  const bookingData = {
    departure: booking.departureAirportName || booking.FlightSchedule?.departure_airport?.airport_name || "Unknown Airport",
    arrival: booking.arrivalAirportName || booking.FlightSchedule?.arrival_airport?.airport_name || "Unknown Airport",
    selectedDate: booking.bookDate ? new Date(booking.bookDate).toLocaleDateString() : "N/A",
    id: booking.schedule_id || "N/A",
    departureTime: booking.FlightSchedule?.departure_time || "N/A",
    arrivalTime: booking.FlightSchedule?.arrival_time || "N/A",
    totalPrice: booking.totalFare ? parseFloat(booking.totalFare).toFixed(2) : "0.00",
  };

  const travelerDetails = booking.passengers?.map((p, idx) => ({
    title: p.title || "N/A",
    fullName: p.name || "N/A",
    dateOfBirth: p.dob ? new Date(p.dob).toLocaleDateString() : "N/A",
    email: idx === 0 ? booking.email_id : null,
    phone: idx === 0 ? booking.contact_no : null,
    address: idx === 0 ? booking.billing?.billing_address : null,
    age: p.age || "N/A",
    type: p.passenger_type || "Adult",
  })) || [];

  const bookingResult = {
    booking: {
      pnr: booking.pnr || "N/A",
      bookingNo: booking.bookingNo || "N/A",
    },
  };

  const totalPassengers = travelerDetails.length;
  const ticketNumber = bookingResult.booking.pnr || `TICKET-${Date.now().toString(36).toUpperCase()}`;

  const handleDownload = () => {
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Colors
      const primaryColor = [79, 70, 229]; // #4f46e5
      const textColor = [31, 41, 55]; // #1f2937
      const mutedColor = [107, 114, 128]; // #6b7280
      const greenColor = [22, 163, 74]; // #16a34a
      const linkColor = [37, 99, 235]; // #2563eb

      // Fonts
      doc.setFont("Helvetica");

      // Header
      let y = 40;
      doc.setFontSize(24);
      doc.setTextColor(...primaryColor);
      doc.text("Jet Serveaviation", 40, y);
      y += 30;
      doc.setFontSize(18);
      doc.setTextColor(...textColor);
      doc.text("E-Ticket", 40, y);
      y += 20;
      doc.setFontSize(12);
      doc.setTextColor(...mutedColor);
      doc.text(`Ticket Number: ${bookingResult.booking.pnr}`, 40, y);
      y += 15;
      doc.text(`Booking No: ${bookingResult.booking.bookingNo}`, 40, y);
      y += 30;

      // Flight Information Section
      doc.setFillColor(249, 250, 251);
      doc.rect(40, y - 10, 515, 90, "F");
      doc.setDrawColor(229, 231, 235);
      doc.rect(40, y - 10, 515, 90);
      doc.setFontSize(16);
      doc.setTextColor(...textColor);
      doc.text("Flight Information", 50, y);
      y += 20;
      doc.setFontSize(12);
      doc.setTextColor(...textColor);
      doc.text(`From: ${bookingData.departure}`, 50, y);
      doc.text(`To: ${bookingData.arrival}`, 300, y);
      y += 15;
      doc.text(`Date: ${bookingData.selectedDate}`, 50, y);
      doc.text(`Flight ID: ${bookingData.id}`, 300, y);
      y += 15;
      doc.text(`Departure: ${bookingData.departureTime}`, 50, y);
      doc.text(`Arrival: ${bookingData.arrivalTime}`, 300, y);
      y += 15;
      doc.text(`Passengers: ${totalPassengers}`, 50, y);
      y += 40;

      // Traveller Details Section
      doc.setFillColor(249, 250, 251);
      doc.rect(40, y - 10, 515, 150, "F");
      doc.setDrawColor(229, 231, 235);
      doc.rect(40, y - 10, 515, 150);
      doc.setFontSize(16);
      doc.setTextColor(...textColor);
      doc.text("Traveller(s)", 50, y);
      y += 20;
      doc.setFontSize(12);
      if (travelerDetails.length > 0) {
        travelerDetails.forEach((t, idx) => {
          doc.setTextColor(...textColor);
          doc.setFont("Helvetica", "bold");
          doc.text(`#${idx + 1} – ${t.title} ${t.fullName} (${t.type})`, 50, y);
          y += 15;
          doc.setFont("Helvetica", "normal");
          doc.setTextColor(...mutedColor);
          doc.text(`DOB: ${t.dateOfBirth}`, 50, y);
          y += 15;
          doc.text(`Age: ${t.age}`, 50, y);
          if (idx === 0) {
            y += 15;
            doc.text(`${t.email || "N/A"}`, 50, y);
            y += 15;
            doc.text(`${t.phone || "N/A"}`, 50, y);
            y += 15;
            doc.text(`${t.address || "N/A"}`, 50, y);
          }
          y += 20;
          doc.setDrawColor(229, 231, 235);
          doc.line(50, y - 10, 545, y - 10);
        });
      } else {
        doc.setTextColor(...mutedColor);
        doc.text("No traveller details available", 50, y);
        y += 20;
      }
      y += 30;

      // Price Summary Section
      doc.setFillColor(249, 250, 251);
      doc.rect(40, y - 10, 515, 50, "F");
      doc.setDrawColor(229, 231, 235);
      doc.rect(40, y - 10, 515, 50);
      doc.setFontSize(16);
      doc.setTextColor(...textColor);
      doc.text("Price Summary", 50, y);
      y += 20;
      doc.setFontSize(12);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(["Total Price:"], 50, y);
      doc.setTextColor(...greenColor);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text([`INR ${bookingData.totalPrice}`], 120, y);
      y += 40;

      // Important Information Section
      doc.setFillColor(249, 250, 251);
      doc.rect(40, y - 10, 515, 300, "F");
      doc.setDrawColor(229, 231, 235);
      doc.rect(40, y - 10, 515, 300);
      doc.setFontSize(16);
      doc.setTextColor(...textColor);
      doc.text("Important Information", 50, y);
      y += 20;
      doc.setFontSize(12);

      // Check-in
      doc.setTextColor(...textColor);
      doc.setFont("Helvetica", "bold");
      doc.text("Check-in", 50, y);
      y += 15;
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(...textColor);
      doc.text("Passengers must check-in 1 hour prior to scheduled departure.", 50, y);
      y += 15;
      doc.text("All passengers (including children and infants) must present valid ID", 50, y);
      y += 15;
      doc.text("(Passport, PAN Card, Election Card, or any photo ID) at check-in.", 50, y);
      y += 20;

      // Baggage Policy
      doc.setFont("Helvetica", "bold");
      doc.text("Baggage Policy", 50, y);
      y += 15;
      doc.setFont("Helvetica", "normal");
      doc.text("Only cabin baggage is allowed, subject to restrictions:", 50, y);
      y += 15;
      doc.text("• Maximum size: 115cm (length + width + height)", 60, y);
      y += 15;
      doc.text("• Maximum weight: 7kg", 60, y);
      y += 15;
      doc.text("Extra baggage may be offloaded or allowed at INR 1000/- per kg, subject", 50, y);
      y += 15;
      doc.text("to space availability.", 50, y);
      y += 20;

      // Cancellation Procedure
      doc.setFont("Helvetica", "bold");
      doc.text("Cancellation Procedure", 50, y);
      y += 15;
      doc.setFont("Helvetica", "normal");
      doc.text("E-Tickets can only be cancelled via email at booking@flyolaindia.com.", 50, y);
      y += 15;
      doc.text("Cancellations are not permitted at face-to-face counters.", 50, y);
      y += 15;
      doc.text("Cancellations are allowed up to 24 hours before departure.", 50, y);
      y += 15;
      doc.text("Cancellations will be confirmed online, and refunds will be credited to", 50, y);
      y += 15;
      doc.text("the original payment account.", 50, y);
      y += 20;

      // Refund Policy
      doc.setFont("Helvetica", "bold");
      doc.text("Refund Policy", 50, y);
      y += 15;
      doc.setFont("Helvetica", "normal");
      doc.text("• More than 96 hours before departure: INR 400/- per seat cancellation fee.", 60, y);
      y += 15;
      doc.text("• 48–96 hours before departure: 25% of booking amount deducted.", 60, y);
      y += 15;
      doc.text("• 12–48 hours before departure: 50% of booking amount deducted.", 60, y);
      y += 15;
      doc.text("• Less than 12 hours before departure: No refund issued.", 60, y);
      y += 40;

      // Support Contact
      doc.setFontSize(12);
      doc.setTextColor(...mutedColor);
      doc.text("Please carry a valid ID and this ticket for boarding.", 40, y, { align: "center" });
      y += 15;
      doc.text("For support, contact support@flyola.in.", 40, y, { align: "center" });

      // Save the PDF
      doc.save(`flight_ticket_${ticketNumber}.pdf`);
    }).catch((error) => {
      alert("Failed to generate PDF. Please try again.");
    });
  };

  if (!isOpen && !isDownload) return null;

  return (
    <div
      style={{
        position: isDownload ? "absolute" : "fixed",
        top: isDownload ? "-9999px" : 0,
        left: isDownload ? "-9999px" : 0,
        right: isDownload ? "auto" : 0,
        bottom: isDownload ? "auto" : 0,
        backgroundColor: isDownload ? "transparent" : "rgba(0,0,0,0.5)",
        display: isDownload ? "block" : "flex",
        alignItems: isDownload ? "none" : "center",
        justifyContent: isDownload ? "none" : "center",
        zIndex: isDownload ? -1 : 1000,
        overflow: isDownload ? "hidden" : "auto",
        padding: isDownload ? 0 : "20px",
      }}
    >
      <div
        ref={ticketRef}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "896px",
          maxHeight: isDownload ? "none" : "90vh",
          overflowY: isDownload ? "hidden" : "auto",
          padding: "24px",
          position: "relative",
          boxShadow: isDownload ? "none" : "0 4px 6px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {!isDownload && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#4f46e5",
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#4f46e5" }}>
            Jet Serveaviation
          </h1>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", marginTop: "8px" }}>
            E-Ticket
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Ticket Number: <span style={{ fontWeight: "bold" }}>{bookingResult.booking.pnr}</span>
          </p>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Booking No: <span style={{ fontWeight: "bold" }}>{bookingResult.booking.bookingNo}</span>
          </p>
        </div>

        {/* Flight Information */}
        <section style={{ backgroundColor: "#f9fafb", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaPlane style={{ color: "#6366f1" }} /> Flight Information
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "14px", color: "#374151" }}>
            <p><span style={{ fontWeight: "600" }}>From:</span> {bookingData.departure}</p>
            <p><span style={{ fontWeight: "600" }}>To:</span> {bookingData.arrival}</p>
            <p><span style={{ fontWeight: "600" }}>Date:</span> {bookingData.selectedDate}</p>
            <p><span style={{ fontWeight: "600" }}>Flight ID:</span> {bookingData.id}</p>
            <p><span style={{ fontWeight: "600" }}>Departure:</span> {bookingData.departureTime}</p>
            <p><span style={{ fontWeight: "600" }}>Arrival:</span> {bookingData.arrivalTime}</p>
            <p><span style={{ fontWeight: "600" }}>Passengers:</span> {totalPassengers}</p>
          </div>
        </section>

        {/* Traveller Details */}
        <section style={{ backgroundColor: "#f9fafb", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb", marginTop: "32px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaUserFriends style={{ color: "#6366f1" }} /> Traveller(s)
          </h3>
          <div style={{ marginTop: "16px" }}>
            {travelerDetails.length > 0 ? (
              travelerDetails.map((t, idx) => (
                <div key={idx} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "16px", marginBottom: "16px" }}>
                  <p style={{ fontWeight: "600", color: "#1f2937" }}>
                    #{idx + 1} – {t.title} {t.fullName} ({t.type})
                  </p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>DOB: {t.dateOfBirth}</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>Age: {t.age}</p>
                  {idx === 0 && (
                    <div style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
                      <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaEnvelope style={{ color: "#6366f1" }} /> {t.email || "N/A"}
                      </p>
                      <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaPhone style={{ color: "#6366f1" }} /> {t.phone || "N/A"}
                      </p>
                      {t.address && (
                        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FaMapMarkerAlt style={{ color: "#6366f1" }} /> {t.address || "N/A"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ fontSize: "14px", color: "#6b7280" }}>No traveller details available.</p>
            )}
          </div>
        </section>

        {/* Price Summary */}
        <section style={{ backgroundColor: "#f9fafb", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb", marginTop: "32px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaInfoCircle style={{ color: "#6366f1" }} /> Price Summary
          </h3>
          <p style={{ fontSize: "14px", color: "#374151" }}>
            Total Price:{" "}
            <span style={{ fontSize: "24px", fontWeight: "bold", color: "#16a34a" }}>
              INR {bookingData.totalPrice}
            </span>
          </p>
        </section>

        {/* Policies */}
        <section style={{ backgroundColor: "#f9fafb", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb", marginTop: "32px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaInfoCircle style={{ color: "#6366f1" }} /> Important Information
          </h3>
          <div style={{ marginTop: "16px", fontSize: "14px", color: "#374151", lineHeight: "1.5" }}>
            <div>
              <h4 style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaClock style={{ color: "#6366f1" }} /> Check-in
              </h4>
              <p>Passengers must check-in 1 hour prior to scheduled departure.</p>
              <p>All passengers (including children and infants) must present valid ID (Passport, PAN Card, Election Card, or any photo ID) at check-in.</p>
            </div>
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaLuggageCart style={{ color: "#6366f1" }} /> Baggage Policy
              </h4>
              <p>Only cabin baggage is allowed, subject to restrictions:</p>
              <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                <li>Maximum size: 115cm (length + width + height)</li>
                <li>Maximum weight: 7kg</li>
              </ul>
              <p>Extra baggage may be offloaded or allowed at INR 1000/- per kg, subject to space availability.</p>
            </div>
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaExclamationTriangle style={{ color: "#6366f1" }} /> Cancellation Procedure
              </h4>
              <p>E-Tickets can only be cancelled via email at <a href="mailto:booking@flyolaindia.com" style={{ color: "#2563eb", textDecoration: "underline" }}>booking@flyolaindia.com</a>.</p>
              <p>Cancellations are not permitted at face-to-face counters.</p>
              <p>Cancellations are allowed up to 24 hours before departure.</p>
              <p>Cancellations will be confirmed online, and refunds will be credited to the original payment account.</p>
            </div>
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaInfoCircle style={{ color: "#6366f1" }} /> Refund Policy
              </h4>
              <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "8px" }}>
                <li>More than 96 hours before departure: INR 400/- per seat cancellation fee.</li>
                <li>48–96 hours before departure: 25% of booking amount deducted.</li>
                <li>12–48 hours before departure: 50% of booking amount deducted.</li>
                <li>Less than 12 hours before departure: No refund issued.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Support Contact */}
        <section style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "32px" }}>
          <p>Please carry a valid ID and this ticket for boarding.</p>
          <p>For support, contact <a href="mailto:support@flyola.in" style={{ color: "#2563eb", textDecoration: "underline" }}>support@flyola.in</a>.</p>
        </section>

        {!isDownload && (
          <button
            onClick={handleDownload}
            style={{
              marginTop: "24px",
              width: "100%",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              padding: "12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              border: "none",
              fontSize: "16px",
              fontWeight: "500",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
            disabled={!bookingResult}
            aria-label="Download ticket PDF"
          >
            <FaDownload /> Download Ticket PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketView;