import { Microscope, Bug, BarChart, MapPin, CalendarDays } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function CardContent({ icon, title, text }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h2 className="font-semibold text-base text-gray-900">{title}</h2>
      </div>
      <p className="text-xs text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}

const Grid = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Row 1 */}
      <Link
        to="/upload"
        className="md:col-span-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl p-5 shadow-md border border-emerald-500/60 transition transform hover:scale-[1.01]"
      >
        <CardContent
          icon={<Microscope className="h-7 w-7" />}
          title="Detect Crop Disease"
          text="Upload a crop image and get instant diagnosis with treatment suggestions."
        />
      </Link>

      <Link
        to="/market-trends"
        className="md:col-span-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-2xl p-5 shadow-md border border-amber-400/70 transition transform hover:scale-[1.01]"
      >
        <CardContent
          icon={<BarChart className="h-7 w-7" />}
          title="Market Trends"
          text="Understand commodity price trends for smarter selling decisions."
        />
      </Link>

      {/* Row 2 */}
      <Link
        to="/pest-detection"
        className="md:col-span-1 bg-gradient-to-br from-lime-400 to-lime-500 text-white rounded-2xl p-5 shadow-md border border-lime-400/70 transition transform hover:scale-[1.01]"
      >
        <CardContent
          icon={<Bug className="h-7 w-7" />}
          title="Pest Detection"
          text="Identify harmful pests from crop images instantly."
        />
      </Link>

      <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow-md border border-green-100 transition transform hover:scale-[1.01]">
        <CardContent
          icon={<Microscope className="h-7 w-7 text-emerald-600" />}
          title="AI Advisory"
          text="Get AI-recommended crop planning, fertilizer use, and irrigation tips."
        />
      </div>

      <Link
        to="/market-place"
        className="md:col-span-1 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-5 shadow-md border border-green-500/70 transition transform hover:scale-[1.01]"
      >
        <CardContent
          icon={<MapPin className="h-7 w-7" />}
          title="Nearest Marketplace"
          text="Find verified buyers and sellers near your location."
        />
      </Link>

      {/* Row 3 */}
      <div className="md:col-span-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-2xl p-5 shadow-md border border-sky-500/70 transition transform hover:scale-[1.01]">
        <CardContent
          icon={<Bug className="h-7 w-7" />}
          title="Soil Health Scanner"
          text="Analyze soil condition and nutrient deficiencies using AI tools."
        />
      </div>

      <Link
        to="/crop-calender"
        className="md:col-span-1 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-2xl p-5 shadow-md border border-emerald-400/70 transition transform hover:scale-[1.01]"
      >
        <CardContent
          icon={<CalendarDays className="h-7 w-7" />}
          title="Smart Crop Calendar"
          text="View crop-specific planting and harvesting schedules."
        />
      </Link>

      <div className="md:col-span-1 bg-white rounded-2xl p-5 shadow-md border border-amber-200 transition transform hover:scale-[1.01]">
        <CardContent
          icon={<MapPin className="h-7 w-7 text-amber-500" />}
          title="Nearby Agri Services"
          text="Locate agri shops, labs, and equipment rentals near you."
        />
      </div>
    </div>
  );
};

export default Grid;
