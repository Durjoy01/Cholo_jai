import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useUserContext } from "./user/UserContext.jsx";

const Login = () => {
  const { setUser } = useUserContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit handler for email/password login
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
        setUser(result.user); // Save user on successful login
        setSuccessMessage("Login successful!");
        navigate("/");
      } else {
        const errorData = await response.text();
        const parsedError = JSON.parse(errorData);
        setErrorMessage(parsedError.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("Error during login: " + error.message);
    }
  };

  // Google login success handler
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
        navigate("/");
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
