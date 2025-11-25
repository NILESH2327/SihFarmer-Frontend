import React from "react";
import { postJSON } from "../api";
import { useState } from "react";

export default function AddActivity() {
    const defaultform = {
        type: "",
        date: "",
        note: ""
    }
    const [form, setform] = useState(defaultform);
 const handlesubmit = async (e) => {
    e.preventDefault(); // prevent default form behavior
    console.log("Submitting Activity:", form);

    const res = await postJSON('/activity/add', form);
    console.log("Activity Added:", res);

    setform(defaultform); // reset form fields
}


    const onchange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        });
    }


    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-gray-100">
            {/* Advisory Cards */}
            {/* <div className="space-y-4 mb-6">
        <div className="bg-white shadow p-4 rounded-2xl">
          <h2 className="text-xl font-semibold">⚠ Rain Alert</h2>
          <p className="text-gray-700 mt-1">Kal 80% chance rain. Aaj pesticide spray avoid karein.</p>
        </div>

        <div className="bg-white shadow p-4 rounded-2xl">
          <h2 className="text-xl font-semibold">🐛 Pest Alert</h2>
          <p className="text-gray-700 mt-1">Aapke area me Brinjal Fruit Borer report hua hai. Field me 2-3 leaves inspect karein.</p>
        </div>

        <div className="bg-white shadow p-4 rounded-2xl">
          <h2 className="text-xl font-semibold">🌱 Crop-Specific Action</h2>
          <p className="text-gray-700 mt-1">Paddy ka top-dressing 3 din me due hai.</p>
        </div>

        <div className="bg-white shadow p-4 rounded-2xl">
          <h2 className="text-xl font-semibold">💧 Irrigation Reminder</h2>
          <p className="text-gray-700 mt-1">Soil moisture low hai. Kal subah 20–25 min irrigation karein.</p>
        </div>

        <div className="bg-white shadow p-4 rounded-2xl">
          <h2 className="text-xl font-semibold">🧪 Fertilizer Timing</h2>
          <p className="text-gray-700 mt-1">Next Urea application 4 din baad due hai.</p>
        </div>

        <div className="bg-white shadow p-4 rounded-2xl">
          <h2 className="text-xl font-semibold">🌾 Harvest Window</h2>
          <p className="text-gray-700 mt-1">Crop approx 18–22 din me harvest-ready hoga.</p>
        </div>
      </div> */}

            {/* Add Activity Form */}
            <div className="bg-white shadow p-6 rounded-2xl">
                <h2 className="text-2xl font-semibold mb-4">➕ Add Activity</h2>

                <div className="flex flex-col space-y-3">
                    <form action="" onChange={onchange} onSubmit={handlesubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <select name="type" className="p-3 border rounded-xl">
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
                    <input className="p-3 border rounded-xl" name="note" type="text" placeholder="Activity Note" />
                    <input className="p-3 border rounded-xl" name="date" type="date" />

                    <button type="submit" className="bg-green-600 text-white p-3 rounded-xl text-lg">Submit Activity</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
