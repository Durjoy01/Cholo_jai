import React, { useState } from "react";

const TrainInfo = () => {
  // State variables for managing selected train, suggestions, schedule, operational days, and off day
  const [selectedTrain, setSelectedTrain] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [runsOn, setRunsOn] = useState([]);
  const [offDay, setOffDay] = useState("");

  // Array of available train options with their names and codes
  const trainOptions = [
    { name: "Rangpur Express", code: "772" },
    { name: "Rangpur Express", code: "771" },
    { name: "Dhumketu Express", code: "769" },
    { name: "Dhumketu Express", code: "770" },
    { name: "Ekota Express", code: "705" },
    { name: "Ekota Express", code: "706" },
    { name: "Panchagarh Express", code: "794" },
    { name: "Panchagarh Express", code: "793" },
    { name: "Rupsha Express", code: "727" },
    { name: "Rupsha Express", code: "728" },
    { name: "Drutojan Express", code: "758" },
    { name: "Drutojan Express", code: "757" },
  ];

  // Function to handle input change in the search bar and filter train options based on input
  const handleInputChange = (e) => {
    const input = e.target.value;
    setSelectedTrain(input);

    // Filter train options based on the input (case-insensitive search)
    if (input.length > 0) {
      const filteredSuggestions = trainOptions.filter((train) =>
        `${train.name} (${train.code})`
          .toLowerCase()
          .includes(input.toLowerCase())
      );
      setSuggestions(filteredSuggestions);  // Update suggestions based on the filtered results
    } else {
      setSuggestions([]);  // Clear suggestions if the input is empty
    }
  };

  // Function to handle when a suggestion is clicked, selecting the train and clearing the suggestions
  const handleSuggestionClick = (suggestion) => {
    setSelectedTrain(`${suggestion.name} (${suggestion.code})`);  // Set selected train to the clicked suggestion
    setSuggestions([]);  // Clear the suggestions after selection
  };

  // Function to handle the search logic when the "Search" button is clicked
  const handleSearch = async () => {
    if (selectedTrain) {
      // Extract the train code from the selected train string (e.g., "Rangpur Express (772)")
      const trainCode = selectedTrain.match(/\((\d+)\)/)?.[1];
      if (!trainCode) {
        console.error("Train code not found");  // If no train code is found, log an error
        return;
      }

      try {
        // Fetch train schedule and operational details from an API using the train code
        const response = await fetch(
          `/api/trains/viewRoute?trainCode=${encodeURIComponent(trainCode)}`
        );
        if (!response.ok) throw new Error("Train not found");  // Handle error if the response is not ok
        const data = await response.json();  // Parse the JSON response

        // Update the state with the fetched data
        setSchedule(data.routes);  // Set schedule (routes) data
        setRunsOn(data.runsOn);  // Set the days the train runs on
        setOffDay(data.offDay);  // Set the off day for the train
      } catch (err) {
        console.error("Error fetching schedule:", err);  // Log error if fetching data fails
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Train Schedule Information
        </h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            value={selectedTrain}
            onChange={handleInputChange}  // Handle input change for filtering train options
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:outline-none"
            placeholder="Search train by name or code"
          />
          {/* Display suggestions if there are any */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 z-10">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}  // Handle click on a suggestion
                  className="p-3 cursor-pointer hover:bg-gray-100"
                >
                  {suggestion.name} ({suggestion.code})  {/* Display suggestion */}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}  // Handle search when clicked
          className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Search
        </button>

        {/* Display Operational Details if available */}
        {(runsOn.length > 0 || offDay) && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              Operational Details
            </h2>
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-gray-500 text-sm uppercase">Runs On:</h3>
                <p className="text-gray-700">
                  {runsOn.map((day, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-xs mr-2"
                    >
                      {day}  {/* Display each day the train runs */}
                    </span>
                  ))}
                </p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm uppercase">Off Day:</h3>
                <span className="inline-block bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs">
                  {offDay}  {/* Display the off day */}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Display Schedule Table if schedule data is available */}
        {schedule.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-medium text-gray-700 mb-3">
              Routes for {selectedTrain}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border-b text-gray-600">Station</th>
                    <th className="p-3 border-b text-gray-600">Arrival</th>
                    <th className="p-3 border-b text-gray-600">Halt (min)</th>
                    <th className="p-3 border-b text-gray-600">Departure</th>
                    <th className="p-3 border-b text-gray-600">
                      Duration from Previous
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((route, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="p-3 border-b text-gray-700">
                        {route.station}  {/* Display station name */}
                      </td>
                      <td className="p-3 border-b text-gray-700">
                        {route.arrivalTime}  {/* Display arrival time */}
                      </td>
                      <td className="p-3 border-b text-gray-700">
                        {route.haltMinutes}  {/* Display halt duration in minutes */}
                      </td>
                      <td className="p-3 border-b text-gray-700">
                        {route.departureTime}  {/* Display departure time */}
                      </td>
                      <td className="p-3 border-b text-gray-700">
                        {route.durationFromPrevious}  {/* Display duration from previous station */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainInfo;
