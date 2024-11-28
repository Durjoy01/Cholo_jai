import React, { useState } from "react";

const TrainInfo = () => {
  const [selectedTrain, setSelectedTrain] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [runsOn, setRunsOn] = useState([]);
  const [offDay, setOffDay] = useState("");

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

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSelectedTrain(input);

    if (input.length > 0) {
      const filteredSuggestions = trainOptions.filter((train) =>
        `${train.name} (${train.code})`
          .toLowerCase()
          .includes(input.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedTrain(`${suggestion.name} (${suggestion.code})`);
    setSuggestions([]);
  };

  const handleSearch = async () => {
    if (selectedTrain) {
      const trainCode = selectedTrain.match(/\((\d+)\)/)?.[1];
      if (!trainCode) {
        console.error("Train code not found");
        return;
      }
      try {
        const response = await fetch(
          `/api/trains/viewRoute?trainCode=${encodeURIComponent(trainCode)}`
        );
        if (!response.ok) throw new Error("Train not found");
        const data = await response.json();
        setSchedule(data.routes);
        setRunsOn(data.runsOn);
        setOffDay(data.offDay);
      } catch (err) {
        console.error("Error fetching schedule:", err);
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
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:outline-none"
            placeholder="Search train by name or code"
          />
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 z-10">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-3 cursor-pointer hover:bg-gray-100"
                >
                  {suggestion.name} ({suggestion.code})
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Search
        </button>

        {/* Train Operational Details */}
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
                      {day}
                    </span>
                  ))}
                </p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm uppercase">Off Day:</h3>
                <span className="inline-block bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs">
                  {offDay}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Table */}
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
                        {route.station}
                      </td>
                      <td className="p-3 border-b text-gray-700">
                        {route.arrivalTime}
                      </td>
                      <td className="p-3 border-b text-gray-700">
                        {route.haltMinutes}
                      </td>
                      <td className="p-3 border-b text-gray-700">
                        {route.departureTime}
                      </td>
                      <td className="p-3 border-b text-gray-700">
                        {route.durationFromPrevious}
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
