import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // To wrap the component with Router
import Home from '../../components/Home'; // Adjust the path accordingly

// Mock the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock the fetch function for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ /* Mock API response here */ }),
  })
);

describe('Home Component', () => {
  beforeEach(() => {
    render(
      <Router>
        <Home />
      </Router>
    );
  });

  it('renders the form with all fields and a submit button', () => {
    expect(screen.getByPlaceholderText(/From Station/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/To Station/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Trains/i })).toBeInTheDocument();
  });

  it('displays suggestions when typing in the from station field', () => {
    const fromStationInput = screen.getByPlaceholderText(/From Station/i);
    fireEvent.change(fromStationInput, { target: { value: 'Dhaka' } });

    // Check that the suggestions dropdown appears
    expect(screen.getByText('Dhaka')).toBeInTheDocument();
  });

  it('displays suggestions when typing in the to station field', () => {
    const toStationInput = screen.getByPlaceholderText(/To Station/i);
    fireEvent.change(toStationInput, { target: { value: 'Rajshahi' } });

    // Check that the suggestions dropdown appears
    expect(screen.getByText('Rajshahi')).toBeInTheDocument();
  });

  it('selects a station suggestion when clicked', () => {
    const fromStationInput = screen.getByPlaceholderText(/From Station/i);
    fireEvent.change(fromStationInput, { target: { value: 'Dhaka' } });
    
    fireEvent.click(screen.getByText('Dhaka'));

    // Check if the station value is correctly set in the input
    expect(fromStationInput.value).toBe('Dhaka');
  });

  it('handles form submission and makes an API call', async () => {
    const fromStationInput = screen.getByPlaceholderText(/From Station/i);
    const toStationInput = screen.getByPlaceholderText(/To Station/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const seatTypeSelect = screen.getByRole('combobox');

    // Set values for the form
    fireEvent.change(fromStationInput, { target: { value: 'Dhaka' } });
    fireEvent.change(toStationInput, { target: { value: 'Rajshahi' } });
    fireEvent.change(dateInput, { target: { value: '2024-12-05' } });
    fireEvent.change(seatTypeSelect, { target: { value: 'AC_B' } });

    // Mock the fetch response
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ trainDetails: [] }),
    });

    const submitButton = screen.getByRole('button', { name: /Search Trains/i });
    fireEvent.click(submitButton);

    // Wait for the navigation call after form submission
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });

  it('displays a loading spinner when the form is submitted', () => {
    const fromStationInput = screen.getByPlaceholderText(/From Station/i);
    const toStationInput = screen.getByPlaceholderText(/To Station/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const seatTypeSelect = screen.getByRole('combobox');

    fireEvent.change(fromStationInput, { target: { value: 'Dhaka' } });
    fireEvent.change(toStationInput, { target: { value: 'Rajshahi' } });
    fireEvent.change(dateInput, { target: { value: '2024-12-05' } });
    fireEvent.change(seatTypeSelect, { target: { value: 'AC_B' } });

    const submitButton = screen.getByRole('button', { name: /Search Trains/i });
    fireEvent.click(submitButton);

    // Check for the loading spinner to appear
    expect(screen.getByText('loading...')).toBeInTheDocument();
  });
});
