import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-neutral_black text-white p-4">
      <div className="flex justify-around items-center">
        {/* Left Column */}
        <div className="flex flex-col items-center">
          <p className="mb-2">Powered by</p>
          <img src="/cholo_jai.png" alt="Logo" className="h-10" />
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center">
        <Link to="/TermsAndConditions" className="hover:underline">
              Terms And Condition
            </Link>
            <Link to="/PrivacyPolicy" className="hover:underline">
              privacy
            </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
