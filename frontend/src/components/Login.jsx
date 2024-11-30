import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useUserContext } from "./user/UserContext.jsx";

/**
 * Login Component for user authentication.
 * 
 * This component allows users to log in using either an email/password or Google login.
 * Upon successful login, the user information is stored in the context, and the user is navigated to the home page.
 * 
 * State Management:
 * - formData: Holds email and password for the login form.
 * - errorMessage: Stores the error message in case of failure.
 * - successMessage: Stores the success message after a successful login.
 * 
 * Methods:
 * - handleChange: Handles the change of form input fields.
 * - handleSubmit: Handles the form submission for email/password login.
 * - handleGoogleLoginSuccess: Handles the Google login success, sending the token to the server for authentication.
 */
const Login = () => {
  /**
   * The user context for storing and managing the user state.
   * 
   * @type {Function} setUser - A function to set the user context after successful login.
   */
  const { setUser } = useUserContext();

  /**
   * State to store form data (email and password).
   * 
   * @type {Object}
   * @property {string} email - User's email address.
   * @property {string} password - User's password.
   */
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /**
   * State to store error messages upon failed login.
   * 
   * @type {string}
   */
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * State to store success messages upon successful login.
   * 
   * @type {string}
   */
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * React router's useNavigate hook to navigate users to different routes.
   * 
   * @type {Function} navigate - Function to navigate to different routes.
   */
  const navigate = useNavigate();

  /**
   * Handles the change in form input fields.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event triggered by an input field change.
   * 
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles form submission for email/password login.
   * 
   * Sends the form data (email and password) to the server and processes the response.
   * If login is successful, user data is stored in the context, and the user is navigated to the home page.
   * If there is an error, an error message is displayed.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * 
   * @returns {Promise<void>} - A promise that resolves when the login process is complete.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setUser(result.user); // Store user data on successful login
        setSuccessMessage("Login successful!");
        navigate("/"); // Navigate to the home page
      } else {
        const errorData = await response.text();
        const parsedError = JSON.parse(errorData);
        setErrorMessage(parsedError.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("Error during login: " + error.message);
    }
  };

  /**
   * Handles the success response from Google login.
   * 
   * Sends the Google authentication token to the backend for verification and login.
   * If successful, the user data is stored, and the user is navigated to the home page.
   * If there is an error, an error message is displayed.
   * 
   * @param {Object} credentialResponse - The response object containing the Google token.
   * 
   * @returns {Promise<void>} - A promise that resolves when the Google login process is complete.
   */
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await fetch("/api/users/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (response.ok) {
        const result = await response.json();
        setUser({
          name: result.user.name,
        });
        setSuccessMessage("Google login successful!");
        navigate("/"); // Navigate to the home page after successful login
      } else {
        setErrorMessage("Google login failed");
      }
    } catch (error) {
      setErrorMessage("Google login error: " + error.message);
    }
  };

  return (
    <GoogleOAuthProvider clientId="10099216327-isncj7lb1likkhm5m6meoomk270gmsif.apps.googleusercontent.com">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <main className="bg-white border-2 rounded-lg shadow-md px-8 py-6 w-full max-w-md">
          {/* Google Login Button */}
          <div className="flex justify-center mb-4">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setErrorMessage("Google login failed")}
              cookiePolicy={"single_host_origin"}
            />
          </div>

          {/* OR Separator */}
          <div className="text-center text-gray-500 mb-4">
            <span className="inline-block px-3 bg-white">or</span>
            <hr className="border-t border-gray-300 mt-1" />
          </div>

          {/* Email Field */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-[#21A75C] hover:bg-[#1b9450] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Login
              </button>
            </div>
          </form>

          {/* Error and Success Messages */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
              <strong className="font-bold">Login failed: </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded relative">
              <strong className="font-bold">Success: </strong>
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
        </main>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
