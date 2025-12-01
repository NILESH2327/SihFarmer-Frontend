// -----------------------------------------------
// SchemeForm.jsx (Clean & Structured Version)
// -----------------------------------------------

import { useEffect, useState } from "react";
import { postJSON } from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

//
// ------------------------------------------------
// ToggleButtonGroup Component
// ------------------------------------------------
function ToggleButtonGroup({ value, onChange }) {
  const OPTIONS = ["Add Scheme", "Edit Scheme"];

  return (
    <div className="inline-flex rounded-full border border-emerald-500 p-1 bg-white">
      {OPTIONS.map((option) => {
        const selected = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-6 py-1 text-sm rounded-full transition ${
              selected
                ? "bg-emerald-500 text-white"
                : "text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

//
// ------------------------------------------------
// Main Component: SchemeForm
// ------------------------------------------------
export default function SchemeForm() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
  }, []);
  // ---------------------------------------------
  // Basic States
  // ---------------------------------------------
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("Add Scheme");
  const navigate = useNavigate();

  // ---------------------------------------------
  // Form Data (matches your Mongoose schema)
  // ---------------------------------------------
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "",
    benefits: "",
    eligibility: {
      state: "",
      district: [],
      minLand: "",
      maxLand: "",
      crops: [],
      irrigationRequired: false,
      incomeLimit: "",
    },
    documents: [""],
    deadline: "",
    link: "",
  });

  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);

  // ---------------------------------------------
  // Constants
  // ---------------------------------------------
  const STATES_DISTRICTS = {
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  };

  const DEPARTMENTS = [
    "Agriculture Department",
    "Rural Development",
    "Animal Husbandry",
    "Horticulture",
    "Soil Conservation",
  ];

  const CROPS = [
    "Rice",
    "Wheat",
    "Maize",
    "Pulses",
    "Cotton",
    "Sugarcane",
    "Potato",
  ];

  // ---------------------------------------------
  // Input Handlers
  // ---------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested eligibility fields
    if (name.includes("eligibility.")) {
      const key = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
      return;
    }

    // Handle documents array
    if (name.startsWith("documents.")) {
      const index = parseInt(name.split(".")[1]);
      const updatedDocs = [...formData.documents];
      updatedDocs[index] = value;

      setFormData((prev) => ({ ...prev, documents: updatedDocs }));
      return;
    }

    // Generic fields
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle district selection
  const toggleDistrict = (district) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
  };

  // Toggle crop selection
  const toggleCrop = (crop) => {
    setSelectedCrops((prev) =>
      prev.includes(crop)
        ? prev.filter((c) => c !== crop)
        : [...prev, crop]
    );
  };

  // Add/remove documents
  const addDocumentField = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ""],
    }));
  };

  const removeDocumentField = (index) => {
    let updated = formData.documents.filter((_, i) => i !== index);
    if (updated.length === 0) updated = [""];

    setFormData((prev) => ({ ...prev, documents: updated }));
  };

  // ---------------------------------------------
  // Step Validations
  // ---------------------------------------------
  const validateStep1 = () => {
    return (
      formData.name &&
      formData.department &&
      formData.description &&
      formData.benefits
    );
  };

  const validateStep2 = () => {
    return formData.deadline;
  };

  // Navigation
  const nextStep = () => validateStep1() && setStep(2);
  const prevStep = () => setStep(1);

  // ---------------------------------------------
  // Submit Handler
  // ---------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const payload = {
      ...formData,
      eligibility: {
        ...formData.eligibility,
        district: selectedDistricts,
        crops: selectedCrops,
        minLand: Number(formData.eligibility.minLand) || 0,
        maxLand: Number(formData.eligibility.maxLand) || 0,
        incomeLimit: Number(formData.eligibility.incomeLimit) || 0,
      },
      documents: formData.documents.filter((d) => d.trim()),
    };

    

    const res = await postJSON('/schemes', JSON.stringify(payload));
    console.log(res);
    if(!res.success){
        toast.error("Something Went Wrong!")
    }

    toast.success("Scheme added Successfully");
    navigate('/admin/dashboard')
    

   
  };

  // Step indicator width
  const stepProgress = step === 1 ? "33%" : "100%";

  //
  // ------------------------------------------------
  // JSX Layout
  // ------------------------------------------------
  //
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full max-w-5xl gap-10 px-6 py-10">

        {/* -------------------------------------- */}
        {/* Left Illustration */}
        {/* -------------------------------------- */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-6 flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400 text-emerald-500">
              📋
            </span>
            <span>Required information</span>
          </h2>

          <img
            src="https://images.pexels.com/photos/207756/pexels-photo-207756.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Government scheme"
            className="max-w-xs mb-4"
          />

          <p className="max-w-md text-sm text-gray-500">
            Please fill in all required fields to add agricultural schemes
            for farmers.
          </p>
        </div>

        {/* -------------------------------------- */}
        {/* Right Form Section */}
        {/* -------------------------------------- */}
        <div className="flex-1">
          <div className="rounded-3xl bg-white shadow-[0_0_40px_rgba(0,0,0,0.06)] px-8 py-8">

            {/* Top Toggle */}
            <div className="mb-6">
              <p className="mb-2 text-sm text-gray-600">I want to</p>
              <ToggleButtonGroup value={mode} onChange={setMode} />
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-emerald-500 transition-all duration-300"
                  style={{ width: stepProgress }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span className={step >= 1 ? "text-emerald-600 font-medium" : ""}>
                  Basic Info
                </span>
                <span className={step >= 2 ? "text-emerald-600 font-medium" : ""}>
                  Review
                </span>
              </div>
            </div>

            {/* -------------------------------------- */}
            {/* FORM */}
            {/* -------------------------------------- */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* --------------------------- */}
              {/* STEP 1 */}
              {/* --------------------------- */}
              <div className={step === 1 ? "block" : "hidden"}>
                {/* Name + Department */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Scheme Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="PM Kisan Samman Nidhi"
                      className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:ring-emerald-500"
                    >
                      <option>Select Department</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description + Benefits */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Benefits <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:ring-emerald-500 resize-none"
                  />
                </div>

                {/* Eligibility Card */}
                <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-xl">
                  <h4 className="font-medium text-emerald-800 mb-3">Eligibility Criteria</h4>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {/* State */}
                    <div>
                      <label>State</label>
                      <select
                        name="eligibility.state"
                        value={formData.eligibility.state}
                        onChange={handleInputChange}
                        className="w-full mt-1 rounded border px-2 py-1 text-xs"
                      >
                        <option>Select State</option>
                        {Object.keys(STATES_DISTRICTS).map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Land */}
                    <div>
                      <label>Land (acres)</label>
                      <div className="flex gap-1 mt-1">
                        <input
                          name="eligibility.minLand"
                          type="number"
                          value={formData.eligibility.minLand}
                          onChange={handleInputChange}
                          placeholder="Min"
                          className="w-1/2 rounded border px-2 py-1 text-xs"
                        />
                        <input
                          name="eligibility.maxLand"
                          type="number"
                          value={formData.eligibility.maxLand}
                          onChange={handleInputChange}
                          placeholder="Max"
                          className="w-1/2 rounded border px-2 py-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --------------------------- */}
              {/* STEP 2 */}
              {/* --------------------------- */}
              <div className={step === 2 ? "block" : "hidden"}>

                {/* Documents */}
                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-700">
                    Required Documents <span className="text-red-500">*</span>
                  </label>

                  <div className="space-y-2">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <input
                          name={`documents.${index}`}
                          value={doc}
                          onChange={handleInputChange}
                          placeholder={`Document ${index + 1} (e.g., Aadhaar Card)`}
                          className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
                        />

                        <button
                          type="button"
                          onClick={() => removeDocumentField(index)}
                          className="px-3 py-2 text-xs text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addDocumentField}
                      className="text-emerald-600 text-sm font-medium"
                    >
                      + Add another document
                    </button>
                  </div>
                </div>

                {/* Deadline + Link */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Application Link
                    </label>
                    <input
                      name="link"
                      type="url"
                      value={formData.link}
                      onChange={handleInputChange}
                      placeholder="https://pmkisan.gov.in"
                      className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Review Summary */}
                <div className="p-4 border bg-gray-50 rounded-xl text-sm">
                  <h4 className="font-medium text-gray-800 mb-3">Review</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-medium">Name:</span> {formData.name || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Department:</span>{" "}
                      {formData.department || "—"}
                    </div>
                    <div>
                      <span className="font-medium">State:</span>{" "}
                      {formData.eligibility.state || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Documents:</span>{" "}
                      {formData.documents.filter((d) => d.trim()).length}
                    </div>
                  </div>
                </div>
              </div>

              {/* --------------------------- */}
              {/* Navigation Buttons */}
              {/* --------------------------- */}
              <div className="mt-6 flex items-center justify-between">

                {/* Step Indicator */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-600 font-medium">Step {step}</span>
                  <span className="h-px w-8 bg-emerald-500" />
                  <span className="text-gray-400">of 2</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  {/* Back */}
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </button>
                  )}

                  {/* Next / Submit */}
                  {step === 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep1()}
                      className="px-6 py-2 rounded-md border border-emerald-500 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!validateStep2()}
                      className="px-6 py-2 rounded-md bg-emerald-500 text-white font-medium hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {mode === "Add Scheme" ? "Add Scheme" : "Update Scheme"}
                    </button>
                  )}
                </div>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
