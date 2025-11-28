// RequirementStepOne.jsx
import { useState } from "react";

function ToggleButtonGroup({ value, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-emerald-500 p-1 bg-white">
      {["Sell", "Buy"].map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-6 py-1 text-sm rounded-full transition
              ${selected ? "bg-emerald-500 text-white" : "text-emerald-600 hover:bg-emerald-50"}`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default function RequirementStepOne() {
  const [mode, setMode] = useState("Sell");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full max-w-5xl gap-10 px-6 py-10">
        {/* Left illustration */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-6 flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400 text-emerald-500">
              👍
            </span>
            <span>Required information</span>
          </h2>

          {/* placeholder illustration */}
          <div className="mb-4">
            <img
              src="https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Potato mascot"
              className="max-w-xs"
            />
          </div>

          <p className="max-w-md text-sm text-gray-500">
            Please select your requirement and fill in all the required fields to
            start selling or buying your agri commodities now!
          </p>
        </div>

        {/* Right form card */}
        <div className="flex-1">
          <div className="rounded-3xl bg-white shadow-[0_0_40px_rgba(0,0,0,0.06)] px-8 py-8">
            {/* Top toggle */}
            <div className="mb-6">
              <p className="mb-2 text-sm text-gray-600">I want to</p>
              <ToggleButtonGroup value={mode} onChange={setMode} />
            </div>

            {/* Form fields */}
            <form className="space-y-4">
              {/* Commodity */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Commodity Name <span className="text-red-500">*</span>
                </label>
                <select className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Select Commodity</option>
                </select>
              </div>

              {/* Variety */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Variety/Type <span className="text-red-500">*</span>
                </label>
                <select className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Select Variety</option>
                </select>
              </div>

              {/* Quantity + Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Select Unit</option>
                  </select>
                </div>
              </div>

              {/* State + District */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Select State</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Select District</option>
                  </select>
                </div>
              </div>

              {/* Upload area */}
              <div className="rounded-lg border-2 border-dashed border-emerald-200 bg-emerald-50 px-4 py-6 text-center text-sm text-emerald-700">
                <p>Upload image of your commodity</p>
                <input type="file" className="mt-3 text-xs text-gray-500" />
              </div>

              {/* Step + Next */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-600 font-medium">Step 1</span>
                  <span className="h-px w-8 bg-emerald-500" />
                  <span className="text-gray-400">2</span>
                  <span className="text-gray-400">3</span>
                </div>
                <button
                  type="submit"
                  className="rounded-md border border-emerald-500 px-6 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
