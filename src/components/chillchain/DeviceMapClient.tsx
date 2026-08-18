import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEVICES = [
  {
    id: "CHL-001",
    route: "Indore → Delhi",
    temp: 4.8,
    status: "online",
    lat: 24.5,
    lng: 78.2,
  },
  {
    id: "CHL-002",
    route: "Mumbai → Bhopal",
    temp: 5.2,
    status: "online",
    lat: 21.9,
    lng: 75.1,
  },
  {
    id: "CHL-003",
    route: "Pune → Nagpur",
    temp: 3.9,
    status: "online",
    lat: 19.9,
    lng: 78.0,
  },
  {
    id: "CHL-004",
    route: "Delhi → Kolkata",
    temp: 9.6,
    status: "warning",
    lat: 25.6,
    lng: 84.0,
  },
  {
    id: "CHL-005",
    route: "Chennai → Bengaluru",
    temp: 2.1,
    status: "online",
    lat: 12.6,
    lng: 78.6,
  },
  {
    id: "CHL-006",
    route: "Hyderabad → Vijayawada",
    temp: 6.4,
    status: "online",
    lat: 16.9,
    lng: 79.9,
  },
  {
    id: "CHL-007",
    route: "Ahmedabad → Surat",
    temp: 1.8,
    status: "online",
    lat: 22.1,
    lng: 72.5,
  },
  {
    id: "CHL-008",
    route: "Jaipur → Indore",
    temp: 5.5,
    status: "warning",
    lat: 24.9,
    lng: 75.6,
  },
  {
    id: "CHL-009",
    route: "Lucknow → Patna",
    temp: 7.0,
    status: "online",
    lat: 26.3,
    lng: 83.4,
  },
  {
    id: "CHL-010",
    route: "Kolkata → Guwahati",
    temp: 2.6,
    status: "online",
    lat: 25.8,
    lng: 90.6,
  },
  {
    id: "CHL-011",
    route: "Kochi → Coimbatore",
    temp: 6.1,
    status: "offline",
    lat: 10.6,
    lng: 76.7,
  },
  {
    id: "CHL-012",
    route: "Nashik → Pune",
    temp: 4.4,
    status: "online",
    lat: 19.1,
    lng: 74.3,
  },
];

function statusColor(status: string) {
  if (status === "online") return "#1F9D6C";
  if (status === "warning") return "#D9A441";
  return "#C6483B";
}

export default function DeviceMapClient() {
  return (
    <MapContainer
      center={[21.5, 79]}
      zoom={5}
      style={{
        height: "100%",
        width: "100%",
      }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap &copy; CARTO"
      />

      {DEVICES.map((device) => (
        <CircleMarker
          key={device.id}
          center={[device.lat, device.lng]}
          radius={7}
          pathOptions={{
            color: statusColor(device.status),
            fillColor: statusColor(device.status),
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup>
            <div
              style={{
                fontFamily:
                  '"Geist Mono", "JetBrains Mono", ui-monospace, monospace',
              }}
            >
              <strong>{device.id}</strong>
              <br />
              {device.route}
              <br />
              {device.temp.toFixed(1)}°C · {device.status}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}