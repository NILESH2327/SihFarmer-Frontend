import { Plus } from "lucide-react";
import React from "react";

const SchemeSidebar = ({ selectedFilter, setSelectedFilter, toggleCategory }) => {

  const schemeTypes = [
    "Central Govt",
    "State Govt (Kerala)",
    "Subsidy",
    "Loan Assistance",
    "Insurance",
    "Scholarship",
    "Income Support (PM-KISAN)"
  ];

  const schemeCategories = [
    "Crop Cultivation",
    "Irrigation & Water",
    "Soil Health & Fertilizers",
    "Machinery Subsidy",
    "Pest & Disease Support",
    "Livestock & Fisheries",
    "Organic Farming",
    "Market & Price Support",
    "Women Farmer Schemes"
  ];

  const benefitRanges = [
    "Below ₹5,000",
    "₹5,000 - ₹25,000",
    "₹25,000 - ₹1,00,000",
    "₹1,00,000 - ₹5,00,000",
    "Above ₹5,00,000"
  ];

  return (
    <aside className="w-64 bg-white border-r p-6 overflow-y-auto">
      <h3 className="font-semibold text-lg mb-4 text-green-700">Filter Schemes</h3>

      {/* Scheme Type */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Type</h4>
        {schemeTypes.map((type) => (
          <label
            key={type}
            className="flex items-center gap-2 mb-2 cursor-pointer"
          >
            <input
              type="radio"
              name="schemeType"
              value={type}
              checked={selectedFilter === type}
              onChange={() => setSelectedFilter(type)}
              className="w-4 h-4"
            />
            <span className="text-gray-700">{type}</span>
          </label>
        ))}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Category</h4>
        {schemeCategories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className="flex items-center gap-2 w-full text-left py-1.5 text-gray-700 hover:text-gray-900"
          >
            <Plus className="w-4 h-4 text-green-700" />
            <span>{category}</span>
          </button>
        ))}
      </div>

      {/* Benefit Amount */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Benefit Amount</h4>
        {benefitRanges.map((range) => (
          <label
            key={range}
            className="flex items-center gap-2 mb-2 cursor-pointer"
          >
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-gray-700">{range}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

export default SchemeSidebar;
