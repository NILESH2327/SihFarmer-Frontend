import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getJSON } from "../api";
import { Link } from "react-router-dom";
import {
  Bell,
  Droplets,
  Layers,
  Leaf,
  ListOrdered,
  MapPin,
  Mountain,
  PlusCircle,
  User,
} from "lucide-react";

export default function FarmerProfile() {
  const [lang, setLang] = useState("en-IN");

  const defaultProfile = {
    name: "",
    location: {
      latitude: "",
      longitude: "",
      district: "",
    },
    crop: "",
    landSize: "",
    soilType: "",
    irrigation: "",
    profileImage: null,
    primaryCrop: "",
  };

  const [profile, setProfile] = useState(defaultProfile);

  // Load profile from server on mount (if available)
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getJSON(`/farmer/profile`, token);
        setProfile({ ...res });
      } catch (err) {
        console.log("Server not available, using local profile");
      }
    })();
  }, []);

  /* Small reusable card */
  function DetailCard({ icon, title, value }) {
    return (
      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
        <div className="p-2 bg-green-100 rounded-full">{icon}</div>
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-sm font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-green-100 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-center gap-6 px-6 pt-6 pb-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={
                profile.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
              }
              alt="Farmer"
              className="w-28 h-28 rounded-full border-4 border-green-400 shadow-md object-cover"
            />
          </div>

          {/* Profile Details */}
          <div className="flex-1 w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-green-800">
              {profile.name || "Farmer Name"}
            </h1>

            <p className="text-gray-700 text-sm md:text-base flex items-center gap-2 mt-1">
              <MapPin size={18} className="text-green-600" />
              {profile.location.district || "Location not added"}
            </p>

            {/* Grid Fields */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailCard
                icon={<Leaf className="text-green-600" />}
                title="Primary Crop"
                value={profile.primaryCrop || "—"}
              />

              <DetailCard
                icon={<Mountain className="text-green-600" />}
                title="Land Size"
                value={profile.landSize ? `${profile.landSize} acres` : "—"}
              />

              <DetailCard
                icon={<Mountain className="text-green-600" />}
                title="Soil Type"
                value={profile.soilType || "—"}
              />

              <DetailCard
                icon={<Droplets className="text-green-600" />}
                title="Irrigation"
                value={profile.irrigation || "—"}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mt-2" />

        {/* Menu section */}
        <div className="px-6 py-6 bg-gray-50/60">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Manage your farm data
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Update Profile */}
            <Link
              to={"/update-profile"}
              className="cursor-pointer bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200/80 hover:border-green-200"
            >
              <User className="text-green-700 w-8 h-8 mb-3" />
              <h3 className="text-sm font-semibold text-gray-800">
                Update Profile
              </h3>
              <p className="text-gray-500 text-xs mt-1">
                Edit crop, soil, irrigation & location.
              </p>
            </Link>

            {/* Notifications */}
            <div className="cursor-pointer bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200/80 hover:border-green-200">
              <Bell className="text-green-700 w-8 h-8 mb-3" />
              <h3 className="text-sm font-semibold text-gray-800">
                Notifications
              </h3>
              <p className="text-gray-500 text-xs mt-1">
                View alerts & updates from Krishi.
              </p>
            </div>

            {/* Show Plots */}
            <Link
              to={"/plot"}
              className="cursor-pointer bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200/80 hover:border-green-200"
            >
              <Layers className="text-green-700 w-8 h-8 mb-3" />
              <h3 className="text-sm font-semibold text-gray-800">Show Plots</h3>
              <p className="text-gray-500 text-xs mt-1">
                See all your registered farm plots.
              </p>
            </Link>

            {/* Add Plots */}
            <Link
              to={"/add-plot"}
              className="cursor-pointer bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200/80 hover:border-green-200"
            >
              <PlusCircle className="text-green-700 w-8 h-8 mb-3" />
              <h3 className="text-sm font-semibold text-gray-800">Add Plots</h3>
              <p className="text-gray-500 text-xs mt-1">
                Add new plots with area and crop.
              </p>
            </Link>

            {/* Your Orders */}
            <Link
              to={"/market/farmer"}
              className="cursor-pointer bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200/80 hover:border-green-200"
            >
              <ListOrdered className="text-green-700 w-8 h-8 mb-3" />
              <h3 className="text-sm font-semibold text-gray-800">Your Orders</h3>
              <p className="text-gray-500 text-xs mt-1">
                Manage your created market orders.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
