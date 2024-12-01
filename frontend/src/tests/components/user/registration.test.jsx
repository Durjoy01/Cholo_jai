import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Registration from "./Registration";

// Mocking fetch function globally before each test
global.fetch = jest.fn();

describe("Registration Component", () => {
  
  beforeEach(() => {
    fetch.mockClear(); // Clear any previous mock calls
  });

  it("renders registration form", () => {
    render(<Registration />);
    
    // Check if form fields are rendered
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("displays error message when passwords do not match", async () => {
    render(<Registration />);

    // Fill out the form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password124" } });

    // Submit the form
    fireEvent.click(screen.getByText(/submit/i));

    // Check for error message
    await waitFor(() => expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument());
  });

  it("submits form successfully and displays success message", async () => {
    render(<Registration />);

    // Fill out the form with matching passwords
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });

    // Mock the API response to simulate a successful registration
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: "Registration successful!" }),
    });

    // Submit the form
    fireEvent.click(screen.getByText(/submit/i));

    // Wait for the success message
    await waitFor(() => expect(screen.getByText(/registration successful/i)).toBeInTheDocument());
  });

  it("displays error message on failed registration", async () => {
    render(<Registration />);

    // Fill out the form with matching passwords
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });

    // Mock the API response to simulate a failed registration
    fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: "Registration failed" }),
    });

    // Submit the form
    fireEvent.click(screen.getByText(/submit/i));

    // Wait for the error message
    await waitFor(() => expect(screen.getByText(/registration failed/i)).toBeInTheDocument());
  });

  it("handles API errors and displays an error message", async () => {
    render(<Registration />);

    // Fill out the form with matching passwords
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });

    // Mock the API to throw an error
    fetch.mockRejectedValueOnce(new Error("Network Error"));

    // Submit the form
    fireEvent.click(screen.getByText(/submit/i));

    // Wait for the error message
    await waitFor(() => expect(screen.getByText(/error during registration: network error/i)).toBeInTheDocument());
  });
});
