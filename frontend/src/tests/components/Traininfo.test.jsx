import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TrainInfo from "../../components/Traininfo"; // Adjust the import based on your file structure
import '@testing-library/jest-dom'; // for the extended matchers like toBeInTheDocument

// Mock the fetch API
global.fetch = jest.fn();

describe('TrainInfo component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders the TrainInfo component correctly', () => {
    render(<TrainInfo />);

    // Verify the main heading is present
    expect(screen.getByText(/Train Schedule Information/i)).toBeInTheDocument();
  });

  test('displays train suggestions based on input', async () => {
    render(<TrainInfo />);

    const input = screen.getByPlaceholderText(/Search train by name or code/i);

    // Simulate user typing into the input field
    fireEvent.change(input, { target: { value: "Rangpur" } });

    // Check if suggestions are displayed
    await waitFor(() => {
      expect(screen.getByText(/Rangpur Express \(772\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Rangpur Express \(771\)/i)).toBeInTheDocument();
    });

    // Simulate selecting a suggestion
    fireEvent.click(screen.getByText(/Rangpur Express \(772\)/i));

    // Verify the input field contains the selected train name and code
    expect(input.value).toBe("Rangpur Express (772)");
  });

  test('handles the search button click and displays schedule', async () => {
    // Mocking the fetch API response
    const mockResponse = {
      routes: [
        {
          station: "Dhaka",
          arrivalTime: "10:00 AM",
          haltMinutes: 10,
          departureTime: "10:10 AM",
          durationFromPrevious: "5 hours",
        },
        {
          station: "Chittagong",
          arrivalTime: "3:00 PM",
          haltMinutes: 15,
          departureTime: "3:15 PM",
          durationFromPrevious: "4 hours",
        },
      ],
      runsOn: ["Monday", "Wednesday", "Friday"],
      offDay: "Sunday",
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<TrainInfo />);

    const input = screen.getByPlaceholderText(/Search train by name or code/i);
    fireEvent.change(input, { target: { value: "Rangpur Express" } });
    fireEvent.click(screen.getByText(/Rangpur Express \(772\)/i));

    const searchButton = screen.getByText(/Search/i);
    fireEvent.click(searchButton);

    // Wait for the async fetch to complete and data to be rendered
    await waitFor(() => {
      expect(screen.getByText(/Operational Details/i)).toBeInTheDocument();
      expect(screen.getByText(/Runs On:/i)).toBeInTheDocument();
      expect(screen.getByText(/Monday/i)).toBeInTheDocument();
      expect(screen.getByText(/Sunday/i)).toBeInTheDocument();

      // Check the schedule table content
      expect(screen.getByText(/Dhaka/i)).toBeInTheDocument();
      expect(screen.getByText(/Chittagong/i)).toBeInTheDocument();
      expect(screen.getByText(/10:00 AM/i)).toBeInTheDocument();
      expect(screen.getByText(/3:00 PM/i)).toBeInTheDocument();
      expect(screen.getByText(/5 hours/i)).toBeInTheDocument();
    });
  });

  test('handles the case when no train data is found', async () => {
    // Mocking the fetch API response to simulate a failed train search
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Train not found" }),
    });

    render(<TrainInfo />);

    const input = screen.getByPlaceholderText(/Search train by name or code/i);
    fireEvent.change(input, { target: { value: "Nonexistent Train" } });

    const searchButton = screen.getByText(/Search/i);
    fireEvent.click(searchButton);

    // Check for error handling message or empty state
    await waitFor(() => {
      expect(screen.queryByText(/Operational Details/i)).not.toBeInTheDocument();
    });
  });

  test('displays no schedule when there is no data', async () => {
    // Mocking the fetch API response for an empty schedule
    const mockEmptyResponse = {
      routes: [],
      runsOn: [],
      offDay: "",
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmptyResponse,
    });

    render(<TrainInfo />);

    const input = screen.getByPlaceholderText(/Search train by name or code/i);
    fireEvent.change(input, { target: { value: "Rangpur Express" } });
    fireEvent.click(screen.getByText(/Rangpur Express \(772\)/i));

    const searchButton = screen.getByText(/Search/i);
    fireEvent.click(searchButton);

    // Check that the schedule table is not rendered if no data is available
    await waitFor(() => {
      expect(screen.queryByText(/Routes for/i)).not.toBeInTheDocument();
    });
  });
});
