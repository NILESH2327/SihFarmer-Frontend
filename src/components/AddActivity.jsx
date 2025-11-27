import React from "react";
import { postJSON } from "../api";
import { useState } from "react";

export default function AddActivity() {
  const defaultform = {
    type: "",
    date: "",
    note: ""
  };
  const [form, setform] = useState(defaultform);

  const handlesubmit = async (e) => {
    e.preventDefault(); // prevent default form behavior
    console.log("Submitting Activity:", form);

    const res = await postJSON('/activity/add', form);
    console.log("Activity Added:", res);

    setform(defaultform); // reset form fields
  };

  const onchange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    // breakout container: spans full content width inside Dashboard's padded container
    <div className="w-full ">
      {/* Add Activity Form (card) */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
        <h2 className="text-2xl font-semibold mb-2">➕ Add Activity</h2>
        <p className="text-sm text-gray-500 mb-4">Log field activity quickly — stretches full width of the dashboard content.</p>

        <form action="" onChange={onchange} onSubmit={handlesubmit} className="w-full grid grid-cols-1 gap-4">
          {/* top row: select (left) and date (right) */}
          <div className="w-full flex flex-col md:flex-row md:items-end md:space-x-4">
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-1 block md:hidden">Activity Type</label>
              <select
                name="type"
                value={form.type}
                onChange={onchange}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
              >
                <option value="">Select Activity Type</option>
                <option value="irrigation">Irrigation</option>
                <option value="fertilization">Fertilization</option>
                <option value="pesticide_application">Pesticide Application</option>
                <option value="harvesting">Harvesting</option>
                <option value="sowing">Sowing</option>
                <option value="spraying">Spraying</option>
                <option value="pest">Pest Issue</option>
                <option value="Weatherimpact">Weather Impact</option>
                <option value="Weeding">Weeding</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mt-3 md:mt-0 md:w-44">
              <label className="text-xs text-gray-600 mb-1 block md:hidden">Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={onchange}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          {/* note section: larger rectangle below */}
          <div className="w-full">
            <label className="text-xs text-gray-600 mb-1 block">Activity Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={onchange}
              placeholder="Describe the activity (e.g., 'Urea topdress 25kg/acre', pest signs, doses used, equipment)..."
              className="w-full h-36 p-4 border border-gray-200 rounded-2xl bg-gray-50 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* submit button below note */}
          <div className="w-full flex justify-start">
            <button
              type="submit"
              className="mt-1 w-full md:w-40 bg-green-600 text-white p-3 rounded-xl text-lg hover:bg-green-700 transition-colors"
            >
              Submit Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
