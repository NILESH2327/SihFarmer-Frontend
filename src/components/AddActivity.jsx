import React, { useState } from "react";
import { postJSON } from "../api";
import { toast } from "react-toastify";

export default function AddActivity() {
  const defaultform = {
    type: "",
    date: "",
    note: ""
  };
  const [form, setform] = useState(defaultform);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const res = await postJSON("/activity/add", form);

    if (res.farmerId) {
      toast.success("Activity logged successfully!");
      setform(defaultform);
    } else {
      toast.error("Failed to log activity. Please try again.");
    }
  };

  const onchange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full">
      <div className="bg-white/90 border border-green-100 rounded-xl px-4 py-3 sm:px-5 sm:py-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              ➕ Quick Activity Log
            </h2>
            <p className="text-xs text-gray-500">
              Capture today&apos;s key field work in a few words.
            </p>
          </div>
        </div>

        <form
          onChange={onchange}
          onSubmit={handlesubmit}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-3 items-start"
        >
          {/* Type + Date row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <select
              name="type"
              value={form.type}
              onChange={onchange}
              className="flex-1 min-w-0 px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-200"
            >
              <option value="">Activity type</option>
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

            <input
              name="date"
              type="date"
              value={form.date}
              onChange={onchange}
              className="w-full sm:w-40 px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-200"
            />
          </div>

          {/* Note + button */}
          <div className="flex flex-col sm:flex-row sm:items-stretch gap-2 w-full">
            <textarea
              name="note"
              value={form.note}
              onChange={onchange}
              placeholder="Note (e.g. Urea 25kg/acre, pest signs...)"
              className="flex-1 min-h-[38px] max-h-20 px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 resize-y focus:outline-none focus:ring-1 focus:ring-green-200 w-full"
            />
            <button
              type="submit"
              className="sm:w-32 px-3 py-2 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
