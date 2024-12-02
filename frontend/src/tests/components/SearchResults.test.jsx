import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchResults from "../../components/SearchResults"; 

// Mock the useLocation and useNavigate hooks from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("SearchResults component", () => {
  let mockNavigate;
  let mockUseLocation;

  beforeEach(() => {
    mockNavigate = jest.fn();
    mockUseLocation = jest.spyOn(require("react-router-dom"), "useLocation");

    // Set up a mock for location.state with results
    mockUseLocation.mockReturnValue({
      state: {
        results: [
          {
            trainName: "Express Train",
            trainNumber: "12345",
            boggyType: "AC",
            searchDate: "2024-12-02",
            from: "Dhaka",
            to: "Chittagong",
            ticketPrice: "500",
            availableSeats: 50,
            totalDuration: 180, // 3 hours
          },
        ],
      },
    });

    // Mock useNavigate to track navigation
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);
  });

  test("renders the search results and displays correct information", () => {
    render(
      <Router>
        <SearchResults />
      </Router>
    );

    // Check if the train name and train number are displayed
    expect(screen.getByText(/Express Train/i)).toBeInTheDocument();
    expect(screen.getByText(/12345/i)).toBeInTheDocument();

    // Check if the duration is displayed correctly
    expect(screen.getByText(/Duration: 3h 0m/i)).toBeInTheDocument();

    // Check if the available seats and price are displayed correctly
    expect(screen.getByText(/Available Seats: 50/i)).toBeInTheDocument();
    expect(screen.getByText(/&#2547; 500/i)).toBeInTheDocument();
  });

  test("navigates to train info page when train name is clicked", () => {
    render(
      <Router>
        <SearchResults />
      </Router>
    );

    // Simulate clicking on the train name
    fireEvent.click(screen.getByText(/Express Train/i));

    // Ensure the navigate function was called with the correct URL
    expect(mockNavigate).toHaveBeenCalledWith("/trainInfo/12345");
  });

  test("navigates to seat selection page when 'Select Seats' button is clicked", () => {
    render(
      <Router>
        <SearchResults />
      </Router>
    );

    // Simulate clicking the "Select Seats" button
    fireEvent.click(screen.getByText(/&#2547; 500/i));

    // Check if the navigate function was called with the correct data
    expect(mockNavigate).toHaveBeenCalledWith("/seat-selection", expect.objectContaining({
      state: expect.objectContaining({
        trainName: "Express Train",
        trainNumber: "12345",
        boggyType: "AC",
        searchDate: "2024-12-02",
        price: "500",
        from: "Dhaka",
        to: "Chittagong",
      }),
    }));
  });

  test("displays 'No trains found' message if no results are provided", () => {
    mockUseLocation.mockReturnValue({ state: { results: [] } });

    render(
      <Router>
        <SearchResults />
      </Router>
    );

    // Check if the 'No trains found' message is displayed
    expect(screen.getByText(/No trains found for the selected route and date/i)).toBeInTheDocument();
  });
});
