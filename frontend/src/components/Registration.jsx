import React, { useState } from "react";
/**
 * Registration Component for registering a user with their details
 * 
 * This component allows the user to input their personal details such as name, email, phone, date of birth, address, and password for registration
 * It validates the form and provides feedback based on the success or failure of the registration process
 * 
 * State Management:
 * - formData: Stores the values of the form fields.
 * - errorMessage: Stores any error message to be displayed to the user.
 * - successMessage: Stores any success message to be displayed to the user.
 * 
 * Methods:
 * - handleChange: Handles changes to the form fields and updates the formData state
 * - handleSubmit: Submits the form, checks for validation, and communicates with the backend
 */

const Registration = () => {
/**
* State to hold the form data (name, email, phone, dob, address, password, confirmPassword).
* @type {Object}
*/
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

/**
* State to hold the error message when the form submission fails
* @type {string}
*/

  const [errorMessage, setErrorMessage] = useState("");

/**
* State to hold the success message when the form submission is successful
* @type {string}
*/
  
  const [successMessage, setSuccessMessage] = useState("");
  
/**
* Handles input changes in the form fields and updates the formData state 
* @param {React.ChangeEvent<HTMLInputElement>} e - The input event.
*/
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
/**
* Handles the form submission
* It performs the following:
* 1. Validates the passwords match
* 2. Sends a POST request to the backend with the form data
* 3. Handles the response from the backend and updates the UI with a success or error message
* @param {React.FormEvent<HTMLFormElement>} e - The submit event
* @returns {Promise<void>} - A promise that resolves when the form submission is complete
*/
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          address: formData.address,
          password: formData.password,
        }),
      });
      
      
      if (response.ok) {
        const result = await response.json();
        setSuccessMessage("Registration successful!");
        console.log(result);
        alert("Registration successful!");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Registration failed");
      }
    } catch (error) {
      setErrorMessage("Error during registration: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 rounded-lg shadow-md px-8 py-6 w-full max-w-md"
        >
          <h2 className="text-neutral_grey text-caption font-bold mb-6 text-center">
            Enter the information below to verify and register your NID with Bangladesh Railway Ticketing Service
          </h2>

          {/* Display success or error messages */}
          {errorMessage && (
            <div className="text-red-500 text-caption font-bold mb-4">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="text-green-500 text-caption font-bold mb-4">
              {successMessage}
            </div>
          )}

          {/* Name */}
          <div className="mb-4">
            <label
              className="block text-neutral_black text-caption font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral_grey focus:outline-none focus:shadow-outline"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-neutral_black text-caption font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral_grey focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label
              className="block text-neutral_black text-caption font-bold mb-2"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral_grey focus:outline-none focus:shadow-outline"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label className="block text-neutral_black text-caption font-bold mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral_grey focus:outline-none focus:shadow-outline"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label
              className="block text-neutral_black text-caption font-bold mb-2"
              htmlFor="address"
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral_grey focus:outline-none focus:shadow-outline"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              className="block text-neutral_black text-caption font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral_grey focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label
              className="block text-neutral_black text-caption font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral_grey focus:outline-none focus:shadow-outline"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#21A75C] hover:bg-[#1b9450] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Registration;
