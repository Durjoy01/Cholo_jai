import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || { results: [] };

  const handleTrainClick = (trainNumber) => {
    navigate(`/trainInfo/${trainNumber}`);
  };

  const handleSelectSeats = (result) => {
    navigate("/seat-selection", {
      state: {
        trainName: result.trainName,
        trainNumber: result.trainNumber,
        boggyType: result.boggyType,
        searchDate:result.searchDate,
        price: result.ticketPrice,
        from: result.from,
        to: result.to,
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
                onClick={() => handleTrainClick(result.trainNumber)}
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
                onClick={() => handleSelectSeats(result)}
                className="px-4 py-2 bg-primary_green1 text-white font-semibold rounded hover:bg-primary_green2 transition-colors"
              >
                &#2547; {result.ticketPrice}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No trains found for the selected route and date.</p>
      )}
    </div>
  );
};

export default SearchResults;
