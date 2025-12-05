import React, { useState, useEffect } from "react";
import {
  MapPin,
  Tractor,
  FlaskConical,
  Store,
  Loader2,
  Navigation,
  Sparkles
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Circle } from "react-leaflet";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});



export default function NearbyAgriServices() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState("all");
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distanceLimit, setDistanceLimit] = useState(10);

  // Load Google Maps Script
  useEffect(() => {
    if (!document.getElementById("google-maps-script")) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places`;
      document.body.appendChild(script);
    }
  }, []);

  // Detect location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Please enable location to continue.")
    );
  }, []);

  // ----------------------- Fetch Services -----------------------
const fetchServices = async () => {
  console.log("FETCH FUNCTION CALLED");
  console.log("Current location =", location);

  if (!location) {
    console.log("LOCATION IS NULL → Backend will NOT be called.");
    return;
  }

  const api = import.meta.env.VITE_API_URL;
  console.log("ENV API =", api);

  const finalURL = `${api}/api/services?lat=${location.lat}&lng=${location.lng}&category=${category}`;
  console.log("Calling Backend:", finalURL);

  setLoading(true);

  try {
    const res = await fetch(finalURL);
    console.log("Response Status =", res.status);

    const data = await res.json();
    console.log("DATA RECEIVED:", data);

    setServices(data || []);
  } catch (e) {
    console.error("ERROR calling backend:", e);
  }

  setLoading(false);
};



  // Re-fetch when category changes
  useEffect(() => {
    if (location) fetchServices();
  }, [category]);

  // ----------------------- Distance Filter -----------------------
  useEffect(() => {
    const filteredList = services.filter(
      (s) => s.distance !== undefined && s.distance <= distanceLimit
    );
    setFiltered(filteredList);
  }, [distanceLimit, services]);

  // ----------------------- Smart Suggestions -----------------------
  const getSuggestions = () => {
    if (filtered.length === 0) return [];

    const nearest = filtered[0];

    const mostCommonCategory = filtered.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const topCategory = Object.keys(mostCommonCategory).sort(
      (a, b) => mostCommonCategory[b] - mostCommonCategory[a]
    )[0];

    return [
      { title: "Nearest Service", text: nearest.name },
      { title: "Most Common Nearby", text: topCategory?.toUpperCase() },
      { title: "Total Matches", text: filtered.length + " services" },
    ];
  };

  const openInMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  const categoryOptions = [
    { value: "all", label: "All", icon: Store },
    { value: "shop", label: "Agri Shops", icon: Store },
    { value: "lab", label: "Soil Labs", icon: FlaskConical },
    { value: "tractor", label: "Tractor Rentals", icon: Tractor },
  ];

  return (
    <div className="relative w-full flex justify-center py-10 px-4">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm opacity-90"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2021/09/18/02/27/vietnam-6634082_1280.jpg')",
        }}
      ></div>

      <div className="relative z-10 max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-black mb-3">Nearby Agri Services 🌍</h1>
        <p className="text-black/70 mb-6">
          Find shops, labs, and rentals near your current location.
        </p>

        {/* Category Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {categoryOptions.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                className={`p-4 rounded-xl shadow-md border text-center transition ${
                  category === cat.value
                    ? "bg-green-600 text-white border-green-700"
                    : "bg-white hover:bg-green-50"
                }`}
                onClick={() => setCategory(cat.value)}
              >
                <Icon className="mx-auto mb-2" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Distance Filter */}
        <div className="mb-6">
          <label className="font-semibold">Distance Limit: </label>
          <select
            className="ml-3 p-2 border rounded-lg"
            value={distanceLimit}
            onChange={(e) => setDistanceLimit(Number(e.target.value))}
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={fetchServices}
            className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl flex items-center gap-2 shadow-lg"
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Searching..." : "Find Nearby Services"}
          </button>
        </div>

        {/* Smart Suggestions */}
        {filtered.length > 0 && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
            <h3 className="font-bold flex items-center gap-2 text-green-700 mb-2">
              <Sparkles /> Smart Suggestions
            </h3>
            {getSuggestions().map((s, i) => (
              <p key={i} className="text-gray-700">
                <b>{s.title}:</b> {s.text}
              </p>
            ))}
          </div>
        )}

        {/*Map */}
       {location && (
  <div className="w-full h-72 mb-6 rounded-xl overflow-hidden border shadow">
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      {/* User Location Marker */}
      <Marker position={[location.lat, location.lng]}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Distance Radius Circle */}
      <Circle
        center={[location.lat, location.lng]}
        radius={distanceLimit * 1000}
        pathOptions={{
          color: "green",
          fillColor: "green",
          fillOpacity: 0.15,
        }}
      />

      {/* Service Markers */}
      {filtered.map((s, i) => (
        <Marker key={i} position={[s.lat, s.lng]}>
          <Popup>
            <b>{s.name}</b> <br />
            {s.address} <br />
            {s.distance?.toFixed(2)} km away
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
)}


        {/* Result Cards */}
        <div className="space-y-4">
          {filtered.map((s, i) => (
            <div
              key={i}
              className="p-5 rounded-xl shadow-md bg-white border hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-green-700" />
                <h2 className="text-xl font-semibold">{s.name}</h2>
              </div>

              <p className="text-gray-700">
                <b>Category:</b> {s.category}
              </p>
              <p className="text-gray-700">
                <b>Address:</b> {s.address}
              </p>
              <p className="text-gray-700">
                <b>Distance:</b> {s.distance?.toFixed(2)} km away
              </p>

              <button
                onClick={() => openInMaps(s.lat, s.lng)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
              >
                <Navigation size={18} />
                Open in Google Maps
              </button>
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-black/50 mt-10">
              No services found in this range.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
