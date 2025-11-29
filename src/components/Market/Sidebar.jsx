import { Plus } from 'lucide-react';
import React from 'react'

const Sidebar = ({ selectedFilter, setSelectedFilter, toggleCategory }) => {

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


    return (


        <aside className="w-64 bg-white border-r p-6 overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Filter</h3>

            {/* Type filter */}
            <div className="mb-6">
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                        type="radio"
                        name="type"
                        value="sell"
                        checked={selectedFilter === "sell"}
                        onChange={(e) => setSelectedFilter("sell")}
                    />
                    <span className="text-gray-700">Sellers</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="type"
                        value="buy"
                        checked={selectedFilter === "buy"}
                        onChange={(e) => setSelectedFilter("buy")}
                    />
                    <span className="text-gray-900 font-medium">Buyers</span>
                </label>
            </div>

            {/* Category */}
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

            {/* Price ranges */}
            <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range</h4>
                {priceRanges.map((range) => (
                    <label key={range} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-gray-700">{range}</span>
                    </label>
                ))}
            </div>
        </aside>

    )
};

export default Sidebar;
