import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("");

  // Parse query parameters from URL and make API call if payment is successful
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");

    if (status === "success") {
      setStatusMessage("Payment Successful!");

      // Extracting purchase details from query parameters (still needed for the API call)
      const details = {
        totalCost: queryParams.get("totalCost"),
        userId: queryParams.get("userId"),
        from: queryParams.get("from"),
        to: queryParams.get("to"),
        trainNumber: queryParams.get("trainNumber"),
        trainName: queryParams.get("trainName"),
        searchDate: queryParams.get("searchDate"),
        purchaseDate: queryParams.get("purchaseDate"),
        boggyType: queryParams.get("boggyType"),
        boggyNumber: queryParams.get("boggyNumber"),
        selectedSeats: JSON.parse(queryParams.get("selectedSeats")),
      };

      // API call to create the ticket
      fetch("http://localhost:5000/api/tickets/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trainNumber: details.trainNumber,
          trainName: details.trainName,
          from: details.from,
          to: details.to,
          date: details.searchDate,
          purchaseDate: details.purchaseDate,
          selectedSeats: details.selectedSeats,
          boggy: details.boggyNumber,
          seatType: details.boggyType,
          totalCost: details.totalCost,
          user: details.userId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Ticket created successfully:", data);
        })
        .catch((error) => {
          console.error("Error creating ticket:", error);
        });
    } else {
      setStatusMessage("Payment Failed. Please try again.");
    }

    // Redirect to home page after 5 seconds
    const redirectTimeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(redirectTimeout);
  }, [location.search, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h1
          className={`text-3xl font-semibold mb-4 ${
            statusMessage === "Payment Successful!" ? "text-green-500" : "text-red-500"
          }`}
        >
          {statusMessage}
        </h1>
        <p className="text-gray-500 text-sm mt-2">You will be redirected shortly...</p>
      </div>
    </div>
  );
};

export default Payment;
