import React, { useState, useEffect, useCallback } from 'react';
import { Search, Heart, MapPin, ChevronDown, Plus, Loader2 } from 'lucide-react';
import { CommodityCard } from '../components/CommodityCard';
import { getJSON } from '../api';
import { Link } from 'react-router-dom';

// Header Component (unchanged)
const Header = () => (
  <header 
    className="bg-cover bg-center bg-no-repeat border-b shadow-sm"
    style={{
      backgroundImage:
        "url('https://cdn.pixabay.com/photo/2021/09/18/02/27/vietnam-6634082_1280.jpg')",
    }}
  >
    <div className="bg-white/60 ">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
        type="text"
        placeholder="Search Commodities..."
        className="
        w-full pl-12 pr-4 py-3
        bg-white shadow-lg border border-gray-300
        rounded-xl text-gray-800 font-medium
        placeholder-gray-500
        focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600
        transition-all
        "
      />
   </div>
  </div>
 
      <Link to={'create-requirement'} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
        Sell / Buy
      </Link>
    </div>
  </div>
  </header>
);

// Enhanced Sidebar Component with all filters
const Sidebar = ({ 
  filters, 
  onFilterChange, 
  expandedCategories, 
  toggleCategory,
  isLoading 
}) => (
  <aside className="w-64 bg-white border-r p-6 overflow-y-auto">
    <h3 className="font-semibold text-lg mb-4">Filter</h3>

    {/* Buyer/Seller Filter */}
    <div className="mb-6">
      <label className="flex items-center gap-2 mb-2 cursor-pointer">
        <input 
          type="checkbox" 
          className="w-4 h-4 text-gray-400"
          checked={filters.type === 'sell'}
          onChange={(e) => onFilterChange('type', e.target.checked ? 'sell' : '')}
        />
        <span className="text-gray-700">Sellers</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input 
          type="checkbox" 
          className="w-4 h-4 accent-green-600" 
          checked={filters.type === 'buy'}
          onChange={(e) => onFilterChange('type', e.target.checked ? 'buy' : '')}
        />
        <span className="text-gray-900 font-medium">Buyers</span>
      </label>
    </div>

    {/* Category Filter */}
    <div className="mb-6">
      <h4 className="font-semibold mb-3">Category</h4>
      {['Fruits', 'Grains', 'Nuts & Dry Fruits', 'Oil & Oilseeds', 'Others', 'Pulses', 'Spices', 'Sweeteners', 'Vegetables'].map((category) => (
        <button
          key={category}
          onClick={() => toggleCategory(category)}
          className="flex items-center gap-2 w-full text-left py-1.5 text-gray-700 hover:text-gray-900"
        >
          <Plus className={`w-4 h-4 transition-transform ${expandedCategories.includes(category) ? 'rotate-45' : ''}`} />
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
          placeholder="Min"
          className="w-20 px-2 py-1 border border-gray-300 rounded"
          value={filters.minPrice || ''}
          onChange={(e) => onFilterChange('minPrice', e.target.value || '')}
        />
        -
        <input
          type="number"
          placeholder="Max"
          className="w-20 px-2 py-1 border border-gray-300 rounded"
          value={filters.maxPrice || ''}
          onChange={(e) => onFilterChange('maxPrice', e.target.value || '')}
        />
      </div>
    </div>
  </aside>
);

// Main App Component with Full Filter Integration
const CommodityMarketplace = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
  }, []);
  const [filters, setFilters] = useState({
    type: 'buy', // default to buyers
    product: '',
    variety: '',
    location: '',
    buyingFrequency: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('latest');
  const [favorites, setFavorites] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Update backend filters when sort changes
  const updateSortFilters = useCallback((sortValue) => {
    switch(sortValue) {
      case 'price-low':
        setFilters(prev => ({ ...prev, sortBy: 'price', sortOrder: 'asc' }));
        setSortBy('price-low');
        break;
      case 'price-high':
        setFilters(prev => ({ ...prev, sortBy: 'price', sortOrder: 'desc' }));
        setSortBy('price-high');
        break;
      default:
        setFilters(prev => ({ ...prev, sortBy: 'date', sortOrder: 'desc' }));
        setSortBy('latest');
    }
  }, []);

  // Fetch data from backend
  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = {
        ...filters,
        page,
        limit: filters.limit,
        ...(filters.minPrice && { minPrice: Number(filters.minPrice) }),
        ...(filters.maxPrice && { maxPrice: Number(filters.maxPrice) })
      };

      const response = await getJSON('/requirements', queryParams);
      console.log('Fetched requirements:', response);
      
      if (response.success) {
        setItems(response.data);
        setTotalPages(response.totalPages);
        setCurrentPage(response.page);
      }
    } catch (error) {
      console.error('Failed to fetch requirements:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Filter change handler
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  }, []);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Handle favorite toggle
  const handleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  // Handle pagination
  const goToPage = (page) => {
    fetchData(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex mx-auto">
  
      {/* LEFT side with background */}
      <div
         className="bg-cover bg-center bg-no-repeat"
         style={{
         backgroundImage:
        "url('https://cdn.pixabay.com/photo/2021/09/18/02/27/vietnam-6634082_1280.jpg')",
         }}
      >
        <Sidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
        />
 </div>
        <main className="flex-1 p-6">
          {/* Header with sorting and stats */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Leads from Buyers</h1>
              <p className="text-gray-500 mt-1">
                Showing {items.length} of {totalPages * filters.limit} results
              </p>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => updateSortFilters(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                disabled={loading}
              >
                <option value="latest">Latest Leads</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mr-2" />
              <span>Loading requirements...</span>
            </div>
          ) : (
            <>
              {/* Results grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {items.map((commodity) => (
                  
                  <CommodityCard
                    key={commodity._id || commodity.id}
                    commodity={commodity}
                    onFavorite={handleFavorite}
                    isFavorite={favorites.includes(commodity._id || commodity.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CommodityMarketplace;
