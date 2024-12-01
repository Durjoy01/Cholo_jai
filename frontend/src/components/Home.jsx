import React, { useState, useEffect } from "react";  // Importing necessary React hooks
import { useNavigate } from "react-router-dom";  // Importing the `useNavigate` hook from `react-router-dom` for navigation

const Home = () => {
  const navigate = useNavigate();  // Initialize `navigate` for programmatic navigation
  const [formData, setFormData] = useState({  // State to store the form data
    fromStation: "",
    toStation: "",
    travelDate: "",
    seatType: "",
  });
  
  const [stationOptions] = useState([  // Predefined list of station options
    "Abdulpur",
"Akkelpur",
"Akhaura",
"Azampur",
"Alamdanga",
"Arani",
"B Birampur",
"Biman Bandar",
"Bhanugach",
"Bamondanga",
"Borashi",
"Boral Bridge",
"Baharpur",
"Boalmari Bazar",
"Bhairab Bazar",
"Brahmanbaria",
"Birampur",
"Bogura",
"Bhanga",
"Bonar Para",
"Bheramara",
"BBSetu E",
"Chatmohar",
"Chirirbandar",
"Chandradighalia",
"Choto Bahirbag",
"Chittagong",
"Chuadanga",
"Chapta",
"Chilahati",
"Cumilla",
"Dhaka",
"Dewanganj Bazar",
"Dinajpur",
"Daulatpur",
"Domar",
"Darshana Halt",
"Fulbari",
"Feni",
"Faridpur",
"Gaibandha",
"Gunabati",
"Gobra",
"Gafargaon",
"Gopalganj",
"Ishwardi Bypass",
"Islampur Bazar",
"Ishwardi",
"Jamtail",
"Joydebpur",
"Joypurhat",
"Jashore",
"Jamalpur Town",
"Kismat",
"Kaunia",
"Kotchandpur",
"Kashiani",
"Kurigram",
"Khulna",
"Kushtia Court",
"Kumarkhali",
"Kalukhali",
"Kulaura",
"Khoksha",
"Laksam",
"Mymensingh",
"Mubarakganj",
"Madhukhali",
"Melandah Bazar",
"Maijgaon",
"Natore",
"Nandina",
"Nayapara",
"Noapara",
"Naliagram",
"Nilphamari",
"Parbatipur",
"Panchbibi",
"Poradaha",
"Pangsha",
"Piyarpur",
"Pirganj",
"Rajshahi",
"Ruhia",
"Rajbari",
"Santahar",
"Sardah Road",
"Setabganj",
"SH M Monsur Ali",
"Sonatola",
"Shaistaganj",
"Sylhet",
"Sreemangal",
"Saidpur",
"Talora",
"Thakurgaon Road",
"Tangail",
"Ullapara",
"Pirganj",
"Rangpur",
"Rajshahi",
  ]);

  const [suggestions, setSuggestions] = useState([]);  // State to store the filtered suggestions based on user input
  const [showSuggestions, setShowSuggestions] = useState({  // State to track which input field is showing suggestions
    fromStation: false,
    toStation: false,
  });
  const [loading, setLoading] = useState(false);  // State to track if the search is in progress

  const today = new Date().toISOString().split("T")[0];  // Get today's date to set it as the minimum date for the travel date field

  // Function to handle input changes for the station fields (from and to stations)
  const handleStationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (value) {  // If the user types something, filter station suggestions
      const filteredSuggestions = stationOptions.filter((station) =>
        station.toLowerCase().startsWith(value.toLowerCase())  // Filter stations that start with the input value (case insensitive)
      );
      setSuggestions(filteredSuggestions);  // Set the filtered suggestions
      setShowSuggestions((prev) => ({ ...prev, [field]: true }));  // Show the suggestions dropdown
    } else {
      setShowSuggestions((prev) => ({ ...prev, [field]: false }));  // Hide the suggestions dropdown if input is cleared
    }
  };

  // Function to handle selecting a suggestion
  const handleSelectSuggestion = (field, suggestion) => {
    setFormData((prev) => ({
      ...prev,
      [field]: suggestion,  // Update the form data with the selected suggestion
    }));
    setShowSuggestions((prev) => ({ ...prev, [field]: false }));  // Hide the suggestions dropdown
  };

  // Function to handle blur event (when the input field loses focus)
  const handleBlur = (field) => {
    setTimeout(() => {
      setShowSuggestions((prev) => ({ ...prev, [field]: false }));  // Hide suggestions after a delay to allow for click events
    }, 200);
  };

  // Function to handle the form submission (search for tickets)
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission
    setLoading(true);  // Set loading state to true
    const { fromStation, toStation, travelDate, seatType } = formData;  // Extract form data

    try {
      // Fetch ticket data from the API based on the form inputs
      const response = await fetch(
        `/api/tickets/search?from=${fromStation}&to=${toStation}&date=${travelDate}&type=${seatType}`
      );
      const data = await response.json();  // Parse the response JSON
      navigate("/results", { state: { results: data } });  // Navigate to the results page and pass the data
    } catch (error) {
      console.error("Error fetching train data:", error);  // Log any errors that occur during the fetch
    } finally {
      setLoading(false);  // Set loading state to false after the API call is finished
    }
  };

  return (
    <div>
      <div className="container mx-auto p-6 mt-6 flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
          {loading ? (
            <div className="loading-spinner">loading...</div>  // Display loading message while the data is being fetched
          ) : (
            <form className="bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="From Station"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green3"
                    value={formData.fromStation}  // Bind the value to the state
                    onChange={(e) => handleStationChange("fromStation", e.target.value)}  // Update state on input change
                    onBlur={() => handleBlur("fromStation")}  // Call handleBlur when input loses focus
                  />
                  {showSuggestions.fromStation && (  // Show suggestions if applicable
                    <div className="absolute bg-white border rounded-md w-full mt-1 shadow-lg z-10 max-h-40 overflow-y-auto">
                      {suggestions.length ? (
                        suggestions.map((suggestion) => (
                          <div
                            key={suggestion}
                            onClick={() => handleSelectSuggestion("fromStation", suggestion)}  // Call handleSelectSuggestion when a suggestion is clicked
                            className="p-2 cursor-pointer hover:bg-gray-200"
                          >
                            {suggestion} 
                          </div>
                        ))
                      ) : (
                        <div className="p-2">No suggestions</div>  // Display message if no suggestions found
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="To Station"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green3"
                    value={formData.toStation}
                    onChange={(e) => handleStationChange("toStation", e.target.value)}  // Update state on input change
                    onBlur={() => handleBlur("toStation")}  // Call handleBlur when input loses focus
                  />
                  {showSuggestions.toStation && (  // Show suggestions if applicable
                    <div className="absolute bg-white border rounded-md w-full mt-1 shadow-lg z-10 max-h-40 overflow-y-auto">
                      {suggestions.length ? (
                        suggestions.map((suggestion) => (
                          <div
                            key={suggestion}
                            onClick={() => handleSelectSuggestion("toStation", suggestion)}  // Call handleSelectSuggestion when a suggestion is clicked
                            className="p-2 cursor-pointer hover:bg-gray-200"
                          >
                            {suggestion} 
                          </div>
                        ))
                      ) : (
                        <div className="p-2">No suggestions</div>  // Display message if no suggestions found
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <input
                  type="date"
                  name="travelDate"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green3"
                  value={formData.travelDate}  // Bind the value to the state
                  onChange={(e) => handleStationChange("travelDate", e.target.value)}  // Update state on input change
                  min={today}  // Set the minimum allowed date to today
                  required
                />
                <select
                  name="seatType"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green3"
                  value={formData.seatType}  // Bind the value to the state
                  onChange={(e) => handleStationChange("seatType", e.target.value)}  // Update state on input change
                  required
                >
                  <option value="" disabled>Select Seat Type</option>  // Default option prompting the user to select a seat type
                  <option value="AC_B">AC_B</option>
                  <option value="AC_S">AC_S</option>
                  <option value="SNIGDHA">SNIGDHA</option>
                  <option value="F_BERTH">F_BERTH</option>
                  <option value="F_SEAT">F_SEAT</option>
                  <option value="F_CHAIR">F_CHAIR</option>
                  <option value="S_CHAIR">S_CHAIR</option>
                  <option value="SHULOV">SHULOV</option>
                  <option value="SHOVAN">SHOVAN</option>
                  <option value="AC_CHAIR">AC_CHAIR</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-[#21A75C] hover:bg-[#1b9450] text-white rounded-md transition-colors"
              >
                Search Trains  
              </button>
            </form>
          )}
        </div>

        <div className="container mx-auto p-6 mt-6 flex flex-col lg:flex-row justify-between items-center">
          <img
            src="/train.png"
            alt="Train Journey"
            className="hidden lg:block w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-background p-6 rounded-lg shadow-md">
        <div className="flex justify-around mb-8">
          {/* Instructions */}
          <div className="text-center">
            <img
              aria-hidden="true"
              alt="Search Icon"
              src="https://openui.fly.dev/openui/24x24.svg?text=🔍"
              className="mx-auto mb-2"
            />
            <h3 className="text-lg font-semibold">Search</h3>
            <p className="text-muted-foreground">Choose your origin, destination, journey dates and search for trains</p>
          </div>
          <div className="text-center">
            <img
              aria-hidden="true"
              alt="Select Icon"
              src="https://openui.fly.dev/openui/24x24.svg?text=📋"
              className="mx-auto mb-2"
            />
            <h3 className="text-lg font-semibold">Select</h3>
            <p className="text-muted-foreground">Select your desired seats and choose</p>
          </div>
          <div className="text-center">
            <img
              aria-hidden="true"
              alt="Pay Icon"
              src="https://openui.fly.dev/openui/24x24.svg?text=💳"
              className="mx-auto mb-2"
            />
            <h3 className="text-lg font-semibold">Pay</h3>
            <p className="text-muted-foreground">Pay for the tickets via Debit / Credit Cards or MFS</p>
          </div>
        </div>

        <div className="container mx-auto p-6 mt-6 flex flex-col lg:flex-row justify-between items-center">
          <div>
            <img
              src="/ticketbuying.png"
              alt="Train Journey"
              className="hidden lg:block w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="flex-grow, p-6 ,mt-6">
        <h2 className="text-xl font-bold text-primary mb-4">Instructions to Purchase Tickets</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Tickets can be bought online ten days in advance.</li>
          <li>
            You can pay for the tickets using mobile financial services: 
            <span className="font-semibold"> Bkash, Nagad, Rocket, Upay</span> or debit/credit cards: 
            <span className="font-semibold"> Mastercard, Visa, DBBL Nexus</span>. Other payment options will be available soon.
          </li>
          <li>
            In case of payment or transaction failure, the deducted amount would be refunded by your bank or MFS provider within 8 business days.
          </li>
          <li>
            In case money has been deducted from your card/mobile wallet but you have not received a ticket confirmation, the deducted amount would be refunded by your bank or MFS provider within 8 business days.
          </li>
          <li>
            If you have not received your ticket copy in email, kindly check your Spam/Junk folder. You can also download your ticket copy from the purchase history of your account after you login.
          </li>
        </ul>
      </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
