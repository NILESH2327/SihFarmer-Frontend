import React, { useState } from "react";
import { LocateFixed, Search } from "lucide-react";

const WeatherLocationControls = ({ onLocationSelect }) => {
  const [location, setLocation] = useState("");

  // Handle manual search
  const handleSearch = () => {
    if (!location.trim()) return;
    onLocationSelect(location);
  };

  // Handle GPS detect
  const handleDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=YOUR_KEY&q=${lat},${lon}`
          );
          const data = await res.json();

          const detectedCity = data.location.name;
          setLocation(detectedCity);

          onLocationSelect(detectedCity);
        } catch (err) {
          console.error("Error auto-detecting location", err);
        }
      },
      () => alert("Unable to detect location")
    );
  };

  return (
    <div className="flex items-center justify-end mb-6 space-x-4">

      {/* GPS Detect (Square Box) */}
      <button
        onClick={handleDetect}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 hover:bg-blue-200"
      >
        <LocateFixed className="h-6 w-6 text-blue-600" />
      </button>

      {/* Input + Submit */}
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Enter location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-gray-300 rounded-lg pl-4 pr-12 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
        />

        {/* Submit Button */}
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center h-full"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};

export default WeatherLocationControls;
