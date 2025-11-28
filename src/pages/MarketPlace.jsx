import React, { useState } from 'react';
import { Search, Heart, MapPin, ChevronDown, Plus } from 'lucide-react';
import { CommodityCard } from '../components/CommodityCard';
import RequirementStepOne from '../components/BuySell';

// Sample data
const commodities = [
  {
    id: 1,
    image: '🥔',
    title: 'A Grade Quality Potato required in',
    price: '9',
    unit: 'Kg',
    seller: 'Amol',
    location: 'Pune, Maharashtra',
    date: '22 November 25',
    featured: true
  },
  {
    id: 2,
    image: '🌽',
    title: 'A Grade Quality Maize required',
    price: '16',
    unit: 'Kg',
    seller: 'Madhusudhana',
    location: 'Chitradurga, Karnataka',
    date: '28 November 25',
    featured: false
  },
  {
    id: 3,
    image: '🍎',
    title: 'A Grade Quality Pomegranate',
    price: '95',
    unit: 'Kg',
    seller: 'Suresh',
    location: 'Khordha, Odisha',
    date: '28 November 25',
    featured: false
  },
  {
    id: 4,
    image: '🥜',
    title: 'A Grade Quality Groundnut required',
    price: '100',
    unit: 'Kg',
    seller: 'Rakadhepan',
    location: 'Namakkal, Tamil Nadu',
    date: '28 November 25',
    featured: false
  },
  {
    id: 5,
    image: '🍅',
    title: 'B Grade Quality Tomato required in',
    price: '14',
    unit: 'Kg',
    seller: 'Amol',
    location: 'Pune, Maharashtra',
    date: '28 November 25',
    featured: false
  },
  {
    id: 6,
    image: '🌾',
    title: 'Normal Horse Gram required in Davangere',
    price: '25',
    unit: 'Kg',
    seller: 'Manjunath',
    location: 'Davangere, Karnataka',
    date: '28 November 25',
    featured: false
  },
  {
    id: 7,
    image: '🌰',
    title: 'Normal Ragi required in Bengaluru Rural',
    price: '25',
    unit: 'Kg',
    seller: 'Mahesh',
    location: 'Bengaluru, Karnataka',
    date: '28 November 25',
    featured: false
  },
  {
    id: 8,
    image: '🥜',
    title: 'G20 Groundnut required in Jodhpur',
    price: '70',
    unit: 'Kg',
    seller: 'Vikram',
    location: 'Jodhpur, Rajasthan',
    date: '28 November 25',
    featured: false
  }
];

const categories = [
  'Fruits', 'Grains', 'Nuts & Dry Fruits', 'Oil & Oilseeds', 
  'Others', 'Pulses', 'Spices', 'Sweeteners', 'Vegetables'
];

const priceRanges = [
  'Below 499',
  'Rs:500 to Rs:1499',
  'Rs:1500 to Rs:2499',
  'Rs:2500 to Rs:4999',
  'Above 5000'
];

// Header Component
const Header = () => (
  <header className="bg-white shadow-sm border-b sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Commodities"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
        Sell / Buy
      </button>
    </div>
  </header>
);

// Sidebar Component
const Sidebar = ({ selectedFilter, onFilterChange, expandedCategories, toggleCategory }) => (
  <aside className="w-64 bg-white border-r p-6 overflow-y-auto">
    <h3 className="font-semibold text-lg mb-4">Filter</h3>
    
    {/* Buyer/Seller Filter */}
    <div className="mb-6">
      <label className="flex items-center gap-2 mb-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 text-gray-400" />
        <span className="text-gray-700">Sellers</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 accent-green-600" defaultChecked />
        <span className="text-gray-900 font-medium">Buyers</span>
      </label>
    </div>

    {/* Category Filter */}
    <div className="mb-6">
      <h4 className="font-semibold mb-3">Category</h4>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => toggleCategory(category)}
          className="flex items-center gap-2 w-full text-left py-1.5 text-gray-700 hover:text-gray-900"
        >
          <Plus className="w-4 h-4" />
          <span>{category}</span>
        </button>
      ))}
    </div>

    {/* Verification Badges */}
    <div className="mb-6">
      <label className="flex items-center gap-2 mb-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4" />
        <span className="text-gray-700">KYC Verified</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4" />
        <span className="text-gray-700">Trusted</span>
      </label>
    </div>

    {/* Price Range */}
    <div className="mb-6">
      <h4 className="font-semibold mb-3">Price Range</h4>
      <div className="flex gap-2 mb-3">
        <input
          type="number"
          placeholder="0"
          className="w-20 px-2 py-1 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="10000"
          className="w-20 px-2 py-1 border border-gray-300 rounded"
        />
      </div>
      {priceRanges.map((range) => (
        <label key={range} className="flex items-center gap-2 mb-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4" />
          <span className="text-gray-700">{range}</span>
        </label>
      ))}
    </div>
  </aside>
);



// Main App Component
const CommodityMarketplace = () => {
  const [selectedFilter, setSelectedFilter] = useState('buyers');
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('latest');
  const [favorites, setFavorites] = useState([]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex max-w-7xl mx-auto">
        <Sidebar
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
        />

          
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Leads from Buyers</h1>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                <option value="latest">Latest Leads</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="nearest">Nearest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {commodities.map((commodity) => (
              <CommodityCard
                key={commodity.id}
                commodity={commodity}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommodityMarketplace;