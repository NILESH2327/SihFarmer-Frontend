import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Mountain,
  Languages,
  Loader2,
  LocateFixed,
  Droplet,
  Sprout,
  Ruler,
} from "lucide-react";
import { getJSON, postJSON } from "../api";

export default function UpdateProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    soilType: "",
    location: {
      latitude: "",
      longitude: "",
      district: "",
    },
    language: "ml-IN",
    irrigation: "",
    primaryCrop: "",
    landSize: "",
  });

  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  // Load profile on mount
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getJSON(`/farmer/profile`, token);
        setProfile({ ...profile, ...res });
      } catch (err) {
        console.log("Server not available");
      }
    })();
  }, []);

  // 📍 Auto GPS location
  const autoFillLocation = () => {
    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const long = pos.coords.longitude.toFixed(5);
        const city = await getCityName(lat, long);
        setProfile({ ...profile, location: { latitude: lat, longitude: long, district: city } });
        setLocLoading(false);
      },
      () => {
        alert("Failed to access location");
        setLocLoading(false);
      },
      {
        enableHighAccuracy: true, // use GPS
        timeout: 10000, // wait max 10 sec for precise GPS
        maximumAge: 0, // NO cached locations
      }
    );
  };

  // Submit
  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await postJSON("/farmer/update", profile);
      if (res.ok) alert("Profile updated!");
    } catch {
      alert("Update failed!");
    }

    setLoading(false);
  };

  async function getCityName(lat, lon) {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=0c0fdbaea0ed2ec1f0f82ad4b62eea1b`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0]?.name || "";
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center pb-10 pt-10 relative"
      style={{ backgroundImage: "url('/bgAddCrop.jpg')" }}
    >
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black opacity-30 w-full h-full"></div>

      {/* Main content container */}
      <div className="relative p-6 max-w-4xl mx-auto bg-white bg-opacity-90 rounded-2xl shadow-lg border z-10">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">Update Profile</h1>
        <div className="p-8 rounded-2xl shadow-lg border grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
          {/* Name */}
          <InputField
            label="Full Name"
            icon={<User className="text-green-600" />}
            value={profile.name}
            placeholder="Enter your name"
            onChange={(v) => setProfile({ ...profile, name: v })}
          />

          {/* Email */}
          <InputField
            label="Email"
            icon={<Mail className="text-green-600" />}
            value={profile.email}
            placeholder="Enter email"
            onChange={(v) => setProfile({ ...profile, email: v })}
          />

          {/* Phone */}
          <InputField
            label="Phone"
            icon={<Phone className="text-green-600" />}
            value={profile.phone}
            placeholder="Phone number"
            onChange={(v) => setProfile({ ...profile, phone: v })}
          />

          {/* Primary Crop */}
          <InputField
            label="Primary Crop"
            icon={<Sprout className="text-green-600" />}
            value={profile.primaryCrop}
            placeholder="Eg: Paddy, Banana"
            onChange={(v) => setProfile({ ...profile, primaryCrop: v })}
          />

          {/* Irrigation */}
          <InputField
            label="Irrigation Method"
            icon={<Droplet className="text-green-600" />}
            value={profile.irrigation}
            placeholder="Eg: Drip, Flood, Sprinkler"
            onChange={(v) => setProfile({ ...profile, irrigation: v })}
          />

          {/* Land Size */}
          <InputField
            label="Land Size (in acres)"
            icon={<Ruler className="text-green-600" />}
            value={profile.landSize}
            placeholder="Eg: 2.5"
            onChange={(v) => setProfile({ ...profile, landSize: v })}
          />

          {/* Soil Type */}
          <InputField
            label="Soil Type"
            icon={<Mountain className="text-green-600" />}
            value={profile.soilType}
            placeholder="Soil type"
            onChange={(v) => setProfile({ ...profile, soilType: v })}
          />

          {/* Location with GPS */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Location</label>
            <div className="flex gap-2 border rounded-xl p-3 bg-gray-50 shadow-sm items-center">
              <MapPin className="text-green-600" />
              <input
                type="text"
                className="flex-grow bg-transparent outline-none text-sm"
                placeholder="Enter location"
                value={profile.location.district}
                disabled
              />
              <button
                onClick={autoFillLocation}
                className="p-2 bg-green-200 rounded-lg text-green-800 hover:bg-green-300 transition"
              >
                {locLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LocateFixed className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Preferred Language</label>
            <div className="flex items-center gap-2 border rounded-xl p-3 bg-gray-50 shadow-sm">
              <Languages className="text-green-600" />
              <select
                className="flex-grow bg-transparent outline-none text-sm"
                value={profile.language}
                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
              >
                <option value="ml">Malayalam</option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>

          {/* Submit Button: full width across both columns */}
          <div className="md:col-span-2">
            <button
              onClick={handleSave}
              className="w-full mt-2 bg-green-700 text-white py-3 rounded-xl shadow hover:bg-green-800 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small Reusable Field Component */
function InputField({ label, icon, value, placeholder, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <div className="flex items-center gap-2 border rounded-xl p-3 bg-gray-50 shadow-sm">
        {icon}
        <input
          type="text"
          className="w-full bg-transparent outline-none text-sm"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
