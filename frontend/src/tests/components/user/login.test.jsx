import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./user/UserContext.jsx";
import Login from "./Login";

// Mock react-router-dom's useNavigate
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock UserContext
jest.mock("./user/UserContext.jsx", () => ({
  useUserContext: jest.fn(),
}));

describe("Login Component", () => {
  let navigateMock;
  let setUserMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    setUserMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    useUserContext.mockReturnValue({ setUser: setUserMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Login component", () => {
    render(<Login />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
  });

  test("handles input changes", () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("submits form and navigates on success", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { name: "John Doe" } }),
      })
    );

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => expect(setUserMock).toHaveBeenCalledWith({ name: "John Doe" }));
    expect(navigateMock).toHaveBeenCalledWith("/");
    expect(screen.getByText(/Login successful!/i)).toBeInTheDocument();
  });

  test("displays error on failed login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(JSON.stringify({ message: "Invalid credentials" })),
      })
    );

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument());
  });

  test("handles Google login success", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { name: "Google User" } }),
      })
    );

    render(<Login />);
    const googleLoginButton = screen.getByRole("button", { name: /google login/i });

    fireEvent.click(googleLoginButton);

    await waitFor(() => expect(setUserMock).toHaveBeenCalledWith({ name: "Google User" }));
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  test("handles Google login failure", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<Login />);
    const googleLoginButton = screen.getByRole("button", { name: /google login/i });

    fireEvent.click(googleLoginButton);

    await waitFor(() =>
      expect(screen.getByText(/Google login failed/i)).toBeInTheDocument()
    );
  });
});
