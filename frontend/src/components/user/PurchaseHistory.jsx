import React, { useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import { FaShoppingBag, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaDownload } from "react-icons/fa";
import { format } from "date-fns";

const PurchaseHistory = () => {
  const { user } = useUserContext();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tickets on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`/api/tickets/viewTicket/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setTickets(data); 
        } else {
          setError("Failed to fetch tickets.");
        }
      } catch (error) {
        setError("Error fetching tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user.id]);

  // Function to trigger PDF generation and download
  const handleDownloadPDF = async (ticketId) => {
    try {
      // API call to generate the PDF
      const response = await fetch(`/api/pdf/generateTicketPDF/${ticketId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (response.ok) {
        // Create a Blob from the PDF response and trigger download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ticket_${ticketId}.pdf`; // Dynamically name the PDF file
        link.click();
      } else {
        alert("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF");
    }
  };

  // Render the component
  return (
    <div className="p-6 bg-gray-100 shadow-lg rounded-xl max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Your Purchase History</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading your tickets...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : tickets.length > 0 ? (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="p-6 border border-gray-200 bg-white rounded-lg shadow-md flex items-center justify-between space-x-6 hover:bg-gray-50 transition duration-300"
            >
              <div className="flex items-center space-x-4">
                <FaShoppingBag className="text-blue-600" size={28} />
                <div>
                  <p className="text-lg font-semibold text-gray-800">{ticket.trainName}</p>
                  <div className="flex items-center text-gray-600 space-x-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>{format(new Date(ticket.date), 'dd MMM yyyy')}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>From: {ticket.from}</span> | <span>To: {ticket.to}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <span>Boggy: {ticket.boggy}</span> | <span>Seat: {ticket.selectedSeats}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-gray-900">{ticket.price}</p>

                  <button
                    onClick={() => handleDownloadPDF(ticket._id)}
                    className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
                  >
                    <FaDownload className="mr-2" />
                    Download PDF
                  </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No purchase history available.</p>
      )}
    </div>
  );
};

export default PurchaseHistory;
