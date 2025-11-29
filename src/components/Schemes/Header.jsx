import { Search, Library } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const SchemeHeader = ({ onOpenSchemes }) => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">

        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Government Schemes (PM-KISAN, Subsidies, etc.)"
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Right Button */}
        <Link
          to={'add'}          
          onClick={onOpenSchemes}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 
                     text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          <Library size={20} />
          Eligible Schemes
        </Link>

      </div>
    </header>
  );
};

export default SchemeHeader;
