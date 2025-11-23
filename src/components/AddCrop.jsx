import { useState } from "react";
import axios from "axios";
import { postJSON } from "../api";

export default function AddCropForm() {
  const [form, setForm] = useState({
    cropName: "",
    variety: "",
    sowingDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      
      const res = await postJSON("/farmer/add-crop", form)
      console.log(res);
      setMessage("🌾 Crop added successfully! Calendar generated.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add crop.");
    }

    setLoading(false);
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 shadow-md rounded-xl mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Add Crop to Farmer
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* <div>
          <label className="font-medium">Farmer ID</label>
          <input
            name="farmerId"
            value={form.farmerId}
            onChange={handleChange}
            placeholder="Enter Farmer ID"
            className="w-full mt-1 p-2 border rounded-lg"
            required
          />
        </div> */}

        <div>
          <label className="font-medium">Crop Name</label>
          <input
            name="cropName"
            value={form.cropName}
            onChange={handleChange}
            placeholder="E.g. Paddy, Banana, Brinjal"
            className="w-full mt-1 p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="font-medium">Variety</label>
          <input
            name="variety"
            value={form.variety}
            onChange={handleChange}
            placeholder="E.g. Jyothi, Robusta"
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="font-medium">Sowing Date</label>
          <input
            type="date"
            name="sowingDate"
            value={form.sowingDate}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
        >
          {loading ? "Saving..." : "Add Crop"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-medium text-gray-700">{message}</p>
      )}
    </div>
  );
}
