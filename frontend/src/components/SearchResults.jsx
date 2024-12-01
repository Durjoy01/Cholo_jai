import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResults = () => {
  // Hook to access the location object, which contains the state passed to this component
  const location = useLocation();
  // Hook to navigate to different routes
  const navigate = useNavigate();
  
  // Destructure the 'results' from the location state, defaulting to an empty array if no results are found
  const { results } = location.state || { results: [] };

  // Function to handle a click on a train, navigating to the detailed train information page
  const handleTrainClick = (trainNumber) => {
    navigate(`/trainInfo/${trainNumber}`);  // Navigate to the train info page based on the train number
  };

  // Function to handle selecting seats, navigating to the seat selection page with necessary details
  const handleSelectSeats = (result) => {
    navigate("/seat-selection", {
      state: {
        trainName: result.trainName,  // Pass the train name to the seat selection page
        trainNumber: result.trainNumber,  // Pass the train number to the seat selection page
        boggyType: result.boggyType,  // Pass the boggy type (e.g., sleeper, AC) to the seat selection page
        searchDate: result.searchDate,  // Pass the search date to the seat selection page
        price: result.ticketPrice,  // Pass the ticket price to the seat selection page
        from: result.from,  // Pass the departure station to the seat selection page
        to: result.to,  // Pass the destination station to the seat selection page
      },
    });
  };

  return (
    <div className="container mx-auto p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
      {results.length > 0 ? (
        results.map((result, index) => (
          <div
            key={index}
            className="relative p-6 mb-6 bg-white rounded shadow-md border-l-4 border-primary_green1"
          >
            <div className="flex justify-between items-center">
              <div
                className="text-lg font-semibold text-gray-800 cursor-pointer hover:underline"
                onClick={() => handleTrainClick(result.trainNumber)} // Handle train click
              >
                {result.trainName} <span className="text-gray-600">({result.trainNumber})</span>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {result.boggyType}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">{result.from}</div>
              <div className="relative flex-grow mx-2 h-px bg-gray-300">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs font-semibold text-neutral_black1">
                  Duration: {Math.floor(result.totalDuration / 60)}h {result.totalDuration % 60}m
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">{result.to}</div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">Available Seats: {result.availableSeats}</div>
              <button
                onClick={() => handleSelectSeats(result)} // Handle seat selection click
                className="px-4 py-2 bg-primary_green1 text-white font-semibold rounded hover:bg-primary_green2 transition-colors"
              >
                &#2547; {result.ticketPrice}
              </button>
            </div>
          </div>
        ))
      ) : (
        // Message shown if there are no results
        <p className="text-center text-gray-600">No trains found for the selected route and date.</p>
      )}
    </div>
  );
};

export default SearchResults;
