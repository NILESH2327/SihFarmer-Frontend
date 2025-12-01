import React, { useState } from "react";
import { Cloud, Thermometer, Droplets, Wind } from "lucide-react";
import { LocateFixed, Search } from "lucide-react";
import { toast } from "react-toastify"
import { getWeatherData } from "../lib/actions/weather";

const WeatherCard = ({ Weather, setWeather }) => {
  const [location, setLocation] = useState("");

  // SEARCH manually
  const searchLocation = async (loc) => {
    if (!loc.trim()) return;
    const res = await getWeatherData(loc);
   
    console.log("Searched Weather Data:", res);
    setWeather(res);
  };

  // UI button triggers search
  const handleSearch = () => {
    if (!location.trim()){
      toast.error("Please enter a location");
      return
    };
    searchLocation(location);
  };

  // Detect location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
   

        const detectedCity = geoData.location.name;
        setLocation(detectedCity);
        searchLocation(detectedCity);
      },
      () => alert("Unable to detect location")
    );
  };

  const getweekday = (date) =>
    new Date(date).toLocaleDateString("en-US", { weekday: "short" });

  if (!Weather) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

      {/* Title Row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Cloud className="h-6 w-6 text-blue-600 mr-2" />
          Weather Forecast
        </h2>

        {/* CONTROLS */}
        <div className="flex items-center space-x-4">

          {/* Input + Submit */}
          <div className="relative w-80 ">
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-4 pr-12 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />

            <button
              onClick={handleSearch}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center transition h-full "
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Detect Location Button */}
          <button
            onClick={detectLocation}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 hover:bg-blue-200 transition"
          >
            <LocateFixed className="h-6 w-6 text-blue-600" />
          </button>

        
        </div>
      </div>

      {/* CURRENT WEATHER */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {Weather.location.name}, {Weather.location.country}
            </h3>
            <p className="text-blue-100">{Weather.current.condition.text}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{Weather.current.temp_c}°C</div>
          </div>
        </div>

        {/* details */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-400">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4" />
            <span className="text-sm">Feels like {Weather.current.feelslike_c}°C</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4" />
            <span className="text-sm">{Weather.current.humidity}% Humidity</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4" />
            <span className="text-sm">{Weather.current.wind_kph} km/h</span>
          </div>
        </div>
      </div>

      {/* FORECAST */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center items-center">
        {Weather.forecast.forecastday.map((day, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-900 mb-2">
              {getweekday(day.date)}
            </p>
            <div className="text-2xl mb-2 w-fit mx-auto">
              <img src={day.day.condition.icon} alt="" />
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {day.day.condition.text}
            </p>
            <div className="text-sm">
              <span className="font-semibold">{day.day.maxtemp_c}°</span>
              <span className="text-gray-500 ml-1">{day.day.mintemp_c}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;



// import React, { useState } from "react";
// import { Cloud, Thermometer, Droplets, Wind, LocateFixed, Search } from "lucide-react";
// import { toast } from "react-toastify";
// import { getWeatherData } from "../lib/actions/weather";

// const WeatherCard = ({ Weather, setWeather }) => {
//   const [location, setLocation] = useState("");

//   const searchLocation = async (loc) => {
//     if (!loc.trim()) return;
//     const res = await getWeatherData(loc);
//     setWeather(res);
//   };

//   const handleSearch = () => {
//     if (!location.trim()) {
//       toast.error("Please enter a location");
//       return;
//     }
//     searchLocation(location);
//   };

//   const detectLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation not supported");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         // TODO: replace with your reverse-geo logic
//         const detectedCity = geoData.location.name;
//         setLocation(detectedCity);
//         searchLocation(detectedCity);
//       },
//       () => alert("Unable to detect location")
//     );
//   };

//   const getweekday = (date) =>
//     new Date(date).toLocaleDateString("en-US", { weekday: "short" });

//   if (!Weather) return <div>Loading...</div>;

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4">
//       {/* Header */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
//         <div className="flex items-center gap-2">
//           <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
//             <Cloud className="h-4 w-4 text-blue-600" />
//           </div>
//           <div>
//             <h2 className="text-sm font-semibold text-gray-900">
//               Weather forecast
//             </h2>
//             <p className="text-[11px] text-gray-500">
//               {Weather.location.name}, {Weather.location.country}
//             </p>
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="flex items-center gap-2">
//           <div className="relative w-40 sm:w-52">
//             <input
//               type="text"
//               placeholder="Location"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               className="w-full border border-gray-200 rounded-lg pl-3 pr-9 py-1.5 text-xs shadow-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
//             />
//             <button
//               onClick={handleSearch}
//               className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md flex items-center justify-center transition"
//             >
//               <Search className="h-3 w-3" />
//             </button>
//           </div>

//           <button
//             onClick={detectLocation}
//             className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 transition"
//           >
//             <LocateFixed className="h-4 w-4 text-blue-600" />
//           </button>
//         </div>
//       </div>

//       {/* Current weather */}
//       <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white mb-3">
//         <div className="flex items-center justify-between gap-3">
//           <div>
//             <p className="text-xs text-blue-100">
//               {Weather.current.condition.text}
//             </p>
//             <p className="text-[11px] text-blue-100">
//               Humidity {Weather.current.humidity}% • Wind {Weather.current.wind_kph} km/h
//             </p>
//           </div>
//           <div className="text-right">
//             <div className="text-3xl font-semibold leading-none">
//               {Weather.current.temp_c}°C
//             </div>
//             <p className="text-[11px] text-blue-100">
//               Feels {Weather.current.feelslike_c}°C
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Forecast – compact chips */}
//       <div className="grid grid-cols-4 gap-2">
//         {Weather.forecast.forecastday.slice(0, 4).map((day, index) => (
//           <div
//             key={index}
//             className="text-center px-2 py-2 bg-gray-50 rounded-lg border border-gray-100"
//           >
//             <p className="text-[11px] font-semibold text-gray-800">
//               {getweekday(day.date)}
//             </p>
//             <img
//               src={day.day.condition.icon}
//               alt=""
//               className="w-8 h-8 mx-auto my-1"
//             />
//             <p className="text-[10px] text-gray-500 truncate">
//               {day.day.condition.text}
//             </p>
//             <p className="text-[11px] mt-1">
//               <span className="font-semibold">{day.day.maxtemp_c}°</span>
//               <span className="text-gray-500"> / {day.day.mintemp_c}°</span>
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WeatherCard;
