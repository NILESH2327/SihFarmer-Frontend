import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Example soil type polygons (you can replace with real data)
const soilTypes = [
  {
    name: "Sandy Soil",
    color: "yellow",
    info: "Low nutrients, quick drainage. Good for coconut, watermelon, cashew.",
    coords: [
      [10.05, 76.2],
      [10.15, 76.35],
      [10.0, 76.45],
    ],
  },
  {
    name: "Clay Soil",
    color: "brown",
    info: "High water retention. Good for rice, wheat, pulses.",
    coords: [
      [9.6, 76.4],
      [9.7, 76.55],
      [9.55, 76.65],
    ],
  },
  {
    name: "Loamy Soil",
    color: "green",
    info: "Ideal for most crops — banana, vegetables, rubber.",
    coords: [
      [9.2, 76.8],
      [9.3, 76.95],
      [9.1, 77.05],
    ],
  }
];

export default function SoilTypeMap() {
  return (
    <MapContainer className="w-full h-[500px]" center={[9.9, 76.5]} zoom={8}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Render all soil types */}
      {soilTypes.map((soil, idx) => (
        <Polygon
          key={idx}
          positions={soil.coords}
          pathOptions={{ color: soil.color, weight: 2 }}
        >
          <Popup>
            <h3 className="font-bold">{soil.name}</h3>
            <p>{soil.info}</p>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
}
