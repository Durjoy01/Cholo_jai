import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Payment component that handles the payment status display and ticket creation.
 * It checks for the payment status in the URL query parameters and, if successful, 
 * makes an API call to create a ticket, then redirects the user to the home page.
 * 
 * @component
 * @example
 * // Example usage of the Payment component:
 * return <Payment />;
 */
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * State variable to store the status message indicating whether the payment 
   * was successful or failed.
   * @type {string}
   */
  const [statusMessage, setStatusMessage] = useState("");

  /**
   * useEffect hook that runs when the component is mounted. It:
   * - Parses the query parameters to check the payment status.
   * - Displays the corresponding status message ("Payment Successful!" or "Payment Failed").
   * - If payment is successful, it sends the payment details to the server to create a ticket.
   * - Redirects the user to the home page after 5 seconds.
   * 
   * @returns {void}
   */
  useEffect(() => {
    // Parse the query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");

    // Check if the payment was successful
    if (status === "success") {
      setStatusMessage("Payment Successful!");

      // Extract payment details from the query parameters
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

      // Make an API request to create the ticket on the server
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
      // If the payment failed
      setStatusMessage("Payment Failed. Please try again.");
    }

    // Set up a timeout to redirect the user to the home page after 5 seconds
    const redirectTimeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    // Cleanup function to clear the timeout when the component unmounts
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
