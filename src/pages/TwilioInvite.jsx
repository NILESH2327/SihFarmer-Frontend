import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const TwilioInvite = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center  px-4" style={{ backgroundImage: "url('/bg5.jpg')" }}>
      <div className="bg-white mt-10 mb-10 px-10 py-10 rounded-2xl shadow-2xl w-full max-w-lg border border-green-200 flex flex-col items-center text-center">
        {/* Title */}
        <h2 className="text-2xl font-bold text-green-700 mb-3">
          Subscribe to WhatsApp Alerts
        </h2>
        <p className="text-sm text-gray-500 mb-6  text-sm">
          Powered by Twilio – get real-time Krishi updates on WhatsApp.
        </p>

        {/* QR Card */}
        <div className="relative group w-48 h-48 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-green-200 hover:scale-105 transition-transform duration-300 mb-6">
          <img
            src="./TwilioNotification.png"
            alt="Twilio WhatsApp QR Code"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-700 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
            <p className="text-white font-semibold text-center px-3 text-sm">
              Scan to subscribe on WhatsApp
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 text-sm">
          Scan the QR code to receive market prices, pest alerts, and crop tips
          directly on WhatsApp.
        </p>

        {/* Continue button */}
        <div className="w-full">
          <Link
            to="/login"
            className="w-full block text-center px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:bg-green-700 hover:shadow-xl transition-all duration-300"
          >
            Continue
          </Link>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          By continuing, you agree to receive WhatsApp updates.
        </p>
      </div>
    </div>
  );
};

export default TwilioInvite;
