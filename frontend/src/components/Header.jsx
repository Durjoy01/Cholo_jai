import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "./user/UserContext.jsx";

const Header = () => {
  const { user, logout } = useUserContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary_green text-white p-4 flex justify-between items-center relative"> {/* Added relative positioning */}
      <div className="flex items-center">
        <Link to="/" className="hover:underline">
          <img src="/whitelogo.png" alt="Logo" className="h-10 mr-2" />
        </Link>
      </div>
      <nav className="hidden md:flex">
        <ul className="flex space-x-4 items-center">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <a href="/Traininfo" className="hover:underline">Train information</a>
          </li>
          <li>
            <Link to="/Contactus" className="hover:underline">Contact us</Link>
          </li>
          {user ? (
            <li className="flex items-center">
              <Link to="/profile" className="flex items-center hover:underline">
                <img
                  src={user.profileImage || "/default-profile.png"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full mr-2"
                />
                <span>{user.name}</span>
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:underline">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="md:hidden">
        <button onClick={toggleMenu} className="focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-primary_green text-white rounded-lg shadow-lg md:hidden z-50"> {/* Added z-50 */}
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <a href="/Traininfo" className="hover:underline">Train information</a>
            </li>
            <li>
              <Link to="/Contactus" className="hover:underline">Contact us</Link>
            </li>
            {user ? (
              <li className="flex items-center">
                <Link to="/profile" className="flex items-center hover:underline">
                  <img
                    src={user.profileImage || "/default-profile.png"}
                    alt="Profile"
                    className="h-8 w-8 rounded-full mr-2"
                  />
                  <span>{user.name}</span>
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:underline">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:underline">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
